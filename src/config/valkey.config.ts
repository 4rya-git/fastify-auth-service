import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import Valkey from "ioredis";

const valkey_plugin = fp(async (fastify: FastifyInstance) => {
    const valkey_client = new Valkey(fastify.config.VALKEY_SERVICE_URI);

    valkey_client.on("connect", () => {
        fastify.log.info("Connected to Valkey");
    });

    valkey_client.on("error", (err) => {
        fastify.log.error("Valkey error: ", err);
    });

    fastify.decorate("valkey", valkey_client);

});

export default valkey_plugin;