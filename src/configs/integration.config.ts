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
            providerType: process.env.MAIL_PROVIDER_TYPE,
            sib: {
                apiKey: process.env.SIB_API_KEY,
            },
        },
    })
);
