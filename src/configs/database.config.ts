import { registerAs } from '@nestjs/config';

export default registerAs(
    'database',
    (): Record<string, any> => ({
        host: process.env?.DATABASE_HOST ?? '127.0.0.1',
        port: process.env?.DATABASE_PORT ?? 5432,
        name: process.env?.DATABASE_NAME ?? 'parking-lot-db',
        username: process.env?.DATABASE_USER,
        password: process?.env.DATABASE_PASSWORD,
        debug: process.env.DATABASE_DEBUG === 'true',
        pgadmin: {
            port: Number(process.env.PGADMIN_PORT) || 8080,
            host: process.env.HTTP_HOST || 'localhost',
        },
    })
);

// export default registerAs(
//     'database',
//     (): Record<string, any> => ({
//         host:
//             process.env?.DATABASE_HOST ??
//             'mongodb://localhost:27017,localhost:27018,localhost:27019',
//         name: process.env?.DATABASE_NAME ?? 'ack',
//         user: process.env?.DATABASE_USER,
//         password: process?.env.DATABASE_PASSWORD,
//         debug: process.env.DATABASE_DEBUG === 'true',
//         options: process.env?.DATABASE_OPTIONS,
//     })
// );
