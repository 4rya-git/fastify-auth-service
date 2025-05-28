import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { create_auth_service } from "../services/auth.services";

export const auth_controllers = async (fastify: FastifyInstance) => {
    const auth_service = create_auth_service(fastify);

    return {
        async register_handler(request: FastifyRequest, reply: FastifyReply) {
            const { email, password } = request.body as {email: string; password: string; };
            try {
                const user = await auth_service.register_user(email, password);
                return reply.code(201).send({ id: user._id, email: user.email });
            }
            catch {
                return reply.code(400).send({ error: "Registration failed" });
            }
        },

        async login_handler(request: FastifyRequest, reply: FastifyReply) {
            const { email, password } = request.body as {email: string; password: string; };
            try {
                const tokens = await auth_service.login_user(email, password);
                reply.code(200).send(tokens);
            }
            catch (error) {
                reply.code(401).send({ error: "Login failed" });
            }
        }
    };
}
