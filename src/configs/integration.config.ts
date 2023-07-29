import { registerAs } from '@nestjs/config';

export default registerAs(
    'integration',
    (): Record<string, any> => ({
        storage: {
            redis: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
            },
            minio: {
                accessKey:
                    process.env.MINIO_ACCESS_KEY || '7ahreroK5Rn6F6Wr3bLQ',
                secretKey:
                    process.env.MINIO_SECRET_KEY ||
                    'SBKxpI7ldr9G5diCW7rkWK0KffJC70apLPCSJMG3',
                port: process.env.MINIO_PORT || 9000,
                endpoint: process.env.MINIO_ENDPOINT || '127.0.0.1',
                useSSL: JSON.parse(process.env.MINIO_USE_SSL) || false,
                region: process.env.MINIO_REGION || 'us-east-1',
                bucketName:
                    process.env.MINIO_BUCKET_NAME || 'nest-core-storage-dev',
            },
        },
        mail: {
            providerType: process.env.MAIL_PROVIDER_TYPE,
            sib: {
                apiKey: process.env.SIB_API_KEY,
            },
        },
        notification: {
            fcm: {
                apiKey:
                    process.env.FCM_API_KEY ||
                    'AIzaSyBA-QHtDPVuFZwuaAFJnOGEmUZVa0k-2Ik',

                authDomain:
                    process.env.FCM_AUTH_DOMAIN ||
                    'nest-core-system.firebaseapp.com',
                projectId: process.env.FCM_PROJECT_ID || 'nest-core-system',
                storageBucket:
                    process.env.FCM_STORAGE_BUCKET ||
                    'nest-core-system.appspot.com',
                messagingSenderId:
                    process.env.FCM_MESSAGING_SENDER_ID || '619059218887',
                appId:
                    process.env.FCM_APP_ID ||
                    '1:619059218887:web:33c07a83f17ac5d2c331e2',
                measurementId: process.env.FCM_MEASUREMENT_ID || 'G-QQEZ45GZ1E',
            },
        },
    })
);
