import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../models/user.models";
import { create_jwt_utils } from "../utils/jwt.utils";

export function create_auth_service(fastify: FastifyInstance) {
    const jwt = create_jwt_utils({
        JWT_SECRET: fastify.config.JWT_SECRET,
        JWT_REFRESH_SECRET: fastify.config.JWT_REFRESH_SECRET,
    });

    return {
        async register_user(email: string, password: string) {
            const hash = await bcrypt.hash(password, 10);
            const user = new User({ email: email, password: hash });
            await user.save();
            return user;
        },

        async login_user(email: string, password: string) {
            const user = await User.findOne({ email: email });
            if (!user || ! (await bcrypt.compare(password, user.password))) {
                throw new Error("Invalid credentials");
            }
            const access_token = jwt.generate_access_token( {id: user._id });
            const refresh_token = jwt.generate_refresh_token({ id: user._id });

            user.refresh_token = refresh_token;
            await user.save();

            return { access_token, refresh_token };
        },

        async logout_user(user_id: string) {
            const user = await User.findById(user_id);
            if (user) {
                user.refresh_token = null as unknown as string;
                await user.save();
            }
        },

        async forgot_password(email: string) {
            const user = await User.findOne({ email });
            if (!user) throw new Error("Email not found");

            const token = crypto.randomBytes(32).toString("hex");
            const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

            user.reset_password_token = token;
            user.reset_password_expires = expiry;

            await user.save();

            return token;
        },

        async reset_password(token: string, new_password: string) {
            const user = await User.findOne({
                reset_password_token: token,
                reset_password_expires: { $gt: new Date() }
            });

            if (!user) throw new Error("Token expired or invalid");

            const hash = await bcrypt.hash(new_password, 10);
            user.password = hash;
            user.reset_password_token = null as unknown as string;
            user.reset_password_expires = null as unknown as Date;
            await user.save();
        },

        async refresh_token(refresh_token: string) {
            try {
                const payload = jwt.verify_refresh_token(refresh_token) as { id: string };

                const user = await User.findById(payload.id);
                if (!user || user.refresh_token !== refresh_token) {
                    throw new Error("Invalid refresh token");
                }

                const new_access_token = jwt.generate_access_token({ id: user._id });
                const new_refresh_token = jwt.generate_refresh_token({ id: user._id });

                user.refresh_token = new_refresh_token;
                await user.save();

                return { access_token: new_access_token, refresh_token: new_refresh_token };
            }
            catch (error) {
                throw new Error("Invalid refresh token");
            }
        }
    };
}
