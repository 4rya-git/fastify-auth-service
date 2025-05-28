import fastify from "fastify";
import cors from "@fastify/cors";
import env_plugin from "./config/env.config";
import connect_db from "./config/db.config";
import auth_routes from "./routes/auth.routes";
import user_routes from "./routes/user.routes";
import auth_plugin from "./config/auth.config";

const server = fastify({ logger: true });

server.register(env_plugin);
server.register(connect_db);
server.register(auth_plugin);

server.register(cors, {
    origin: "*",
    credentials: false,
});

server.register(auth_routes, { prefix: "/api" });
server.register(user_routes, { prefix: "/api/user" });

const start_server = async () => {
    await server.ready(); // // Make sure all plugins (including env) are loaded
    server.listen({ port: server.config.PORT }, (err, address) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
}

start_server();
