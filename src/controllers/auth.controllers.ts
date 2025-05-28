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
        },

        async logout_handler(request: FastifyRequest, reply: FastifyReply) {
            try {
                auth_service.logout_user(request.user._id.toString());
                reply.send({ message: "Logged out successfully" });
            }
            catch (error) {
                reply.code(400).send({ error: "Logout failed" });
            }
        },

        async forgot_password_handler(request: FastifyRequest, reply: FastifyReply) {
            const { email } = request.body as { email: string };
            try {
                const token = await auth_service.forgot_password(email);
                reply.send({ reset_token: token });
            }
            catch (error) {
                reply.code(400).send({ error: "Failed to initiate reset" });
            }
        },

        async reset_password_handler(request: FastifyRequest, reply: FastifyReply) {
            const { token, new_password } = request.body as { token: string, new_password: string };
            try {
                await auth_service.reset_password(token, new_password);
                reply.send({ message: "Password updated "});
            }
            catch {
                reply.code(400).send({ error: "Failed to reset password" });
            }
        }
    };
}
