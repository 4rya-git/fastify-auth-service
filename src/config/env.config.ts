import fp from "fastify-plugin";
import fastify_env from "@fastify/env";

const env_schema = {
    type: "object",
    required: ["PORT", "MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"],
    properties: {
        PORT: { type: 'number', default: 8000 },
        MONGO_URI: { type: 'string', minLength: 1 },
        JWT_SECRET: { type: 'string', minLength: 1 },
        JWT_REFRESH_SECRET: { type: 'string', minLength: 1 }
    }
};

const schema_options = {
    confKey: "config",
    schema: env_schema,
    dotenv: true
};

export default fp(async function (fastify, options) {
    await fastify.register(fastify_env, schema_options);
});