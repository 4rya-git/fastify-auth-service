// fastify.d.ts
import 'fastify';
import type mongoose_type from 'mongoose';

declare module 'fastify' {
    interface FastifyInstance {
        // provides type for fastify.config
        config: {
            PORT: number;
            MONGO_URI: string;
            JWT_SECRET: string;
            JWT_REFRESH_SECRET: string;
        };

        // provides type for fastify.mongoose
        mongoose: typeof mongoose_type;
    }
}
