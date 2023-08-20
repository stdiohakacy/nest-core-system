import { registerAs } from '@nestjs/config';

export default registerAs(
    'graphql',
    (): Record<string, any> => ({
        isEnable: process.env.IS_ENABLE_GRAPHQL === 'true',
        url: process.env.GRAPHQL_URL || 'http://localhost:3000/graphql',
    })
);
