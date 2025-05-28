// import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { auth_controllers } from "../controllers/auth.controllers";

const auth_routes = async (fastify: FastifyInstance) => {
    console.log("Registering auth routes");

    const { register_handler, login_handler, logout_handler, forgot_password_handler, reset_password_handler } = await auth_controllers(fastify);
    fastify.post('/register', register_handler);
    fastify.post('/login', login_handler);
    fastify.post('/logout', { preValidation: fastify.authenticate }, logout_handler);
    fastify.post('/forgot-password', forgot_password_handler);
    fastify.post('/reset-password', reset_password_handler);
}

export default auth_routes;