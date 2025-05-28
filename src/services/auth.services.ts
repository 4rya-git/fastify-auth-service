import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
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
        }
    };
}
