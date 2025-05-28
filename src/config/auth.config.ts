import fp from "fastify-plugin";
import { FastifyInstance, FastifyRequest } from "fastify";
import { User } from "../models/user.models";
import { create_jwt_utils } from "../utils/jwt.utils";

export default fp(async (fastify: FastifyInstance) => {
    fastify.decorateRequest('user', null);
    fastify.decorate("authenticate", async (request: FastifyRequest) => {
        try {
            const auth_header = request.headers.authorization;
            if (!auth_header || !auth_header.startsWith("Bearer ")) {
                throw new Error("No token provided");
            }

            const token = auth_header.split(" ")[1];
            const jwt = create_jwt_utils({
                    JWT_SECRET: fastify.config.JWT_SECRET,
                    JWT_REFRESH_SECRET: fastify.config.JWT_REFRESH_SECRET,
            });

            const payload = jwt.verify_access_token(token) as { id: string };
            console.log(payload);

            const user = await User.findById(payload.id);
            if (!user) {
                throw new Error("User not found");
            }

            request.user = user;
        }
        catch (error) {
            throw new Error("Invalid token");
        }
    });
});