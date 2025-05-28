import jwt from 'jsonwebtoken';

export function create_jwt_utils(config: {
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
}) {
    return {
        generate_access_token(payload: object) {
            return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '15m' });
        },

        generate_refresh_token(payload: object) {
            return jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        },

        verify_access_token(token: string) {
            return jwt.verify(token, config.JWT_SECRET);
        },

        verify_refresh_token(token: string) {
            return jwt.verify(token, config.JWT_REFRESH_SECRET);
        }
    };
}
