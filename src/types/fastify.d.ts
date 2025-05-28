// fastify.d.ts
import 'fastify';
import type mongoose_type from 'mongoose';
import Valkey from "ioredis";
import { User } from '../models/user.models';

declare module 'fastify' {
    interface FastifyInstance {
        // provides type for fastify.config
        config: {
            PORT: number;
            MONGO_URI: string;
            JWT_SECRET: string;
            JWT_REFRESH_SECRET: string;
            VALKEY_SERVICE_URI: string;
        };

        // provides type for fastify.mongoose
        mongoose: typeof mongoose_type;

        valkey: Valkey;

        authenticate: (request: FastifyRequest) => Promise<void>;
    }

    interface FastifyRequest {
        user: User;
    }
}
