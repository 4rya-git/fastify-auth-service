import { FastifyRequest, FastifyReply } from "fastify";

export const get_user_profile = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;
    return reply.send({
        id: user._id,
        email: user.email,
        created_at: user.createdAt,
    });
}