import { FastifyInstance } from "fastify";
import { get_user_profile } from "../controllers/user.controllers";

const user_routes = async (fastify: FastifyInstance) => {
    fastify.get("/profile", {
        preValidation: fastify.authenticate,
        handler: get_user_profile
    });
}

export default user_routes;
