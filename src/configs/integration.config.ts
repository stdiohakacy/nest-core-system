import { registerAs } from '@nestjs/config';

export default registerAs(
    'integration',
    (): Record<string, any> => ({
        storage: {
            redis: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
            },
        },
        mail: {
            sib: {
                apiKey: process.env.SIB_API_KEY,
            },
        },
    })
);
