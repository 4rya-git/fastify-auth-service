// import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { auth_controllers } from "../controllers/auth.controllers";

const auth_routes = async (fastify: FastifyInstance, options: object) => {
    console.log("Registering auth routes");

    const { register_handler, login_handler } = await auth_controllers(fastify);
    fastify.post('/register', register_handler);
    fastify.post('/login', login_handler);
}


export default auth_routes;