import { registerAs } from '@nestjs/config';

export default registerAs(
    'integration',
    (): Record<string, any> => ({
        search: {
            elasticsearch: {
                node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
                username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
                password: process.env.ELASTICSEARCH_PASSWORD || 'admin',
            },
            kibana: {
                host: process.env.KIBANA_HOST || 'localhost',
                port: process.env.KIBANA_PORT || 5601,
            },
        },
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
                host: process.env.HTTP_HOST || 'localhost',
                port: process.env.MINIO_PORT || 9000,
                portUI: process.env.MINIO_PORT_UI || 9001,
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
                projectId: process.env.FCM_CLIENT_ID,
                clientEmail: process.env.FCM_CLIENT_EMAIL,
                privateKey: process.env.FCM_PRIVATE_KEY,
                databaseURL: process.env.FCM_DATABASE_URL,
            },
        },
        sms: {
            twilio: {
                accountSid: process.env.TWILIO_ACCOUNT_SID,
                authToken: process.env.TWILIO_AUTH_TOKEN,
                verificationServiceSid:
                    process.env.TWILIO_VERIFICATION_SERVICE_SID,
                senderPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
            },
        },
    })
);
