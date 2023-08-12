import { Module } from '@nestjs/common';
import { DeviceRepository } from './repositories/notification.fcm.device.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from '../../../../modules/notification/entities/device.entity';
import { DeviceRegisterHandler } from './commands/notification.device-register.command';
import { FCMService } from './services/notification.fcm.service';
import { NotificationRepository } from './repositories/notification.fcm.notification.repository';
import { NotificationEntity } from '../../../../modules/notification/entities/notification.entity';
import admin from 'firebase-admin';

const commandHandlers = [DeviceRegisterHandler];
const repositories = [DeviceRepository, NotificationRepository];

@Module({
    imports: [TypeOrmModule.forFeature([DeviceEntity, NotificationEntity])],
    providers: [...commandHandlers, ...repositories, FCMService],
    exports: [...commandHandlers, ...repositories, FCMService],
})
export class FCMModule {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: 'nest-core-system',
                clientEmail:
                    'firebase-adminsdk-icin6@nest-core-system.iam.gserviceaccount.com',
                privateKey:
                    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDNcmRRWcMVE4K6\ncEX84jwEn4kHfrzfFpsZyXe9WTNZHQHKriYAjosltfZIpumQW0BYxLoE7L0PeAGn\nk7f5XUMCzlotBoWAP7UfXc6E4BVf8Xmy1I+0p2bEXowRTkZybwlr5GzjTG4ZUdE0\nQ7fRyh07u7W4hOO044U8vDPStro/FlASn/ZX5barEUbGTmuiNe82WH7XPub76id6\nxMJ7JF2OTB6enyhKQyYiJN15NgfHGIn096cIgnlDL4/03psIxxRoDNsLyBZ+5liB\nR0efrqZCJIfAQzc/jhAiKhbr7QDuweELoW5uKLAC34RKDU+ZAibav11q57T6NFFk\nhvUAWmORAgMBAAECggEAMWbTZphuB5BkfA5pVfDUu8vc+HdqVT6rVx0R9O8RINmP\nx7vumW2tWgkSStAQE81NgMr1bB+9Ko4R38jukUDyzybtmiwaSAeJtxwof90eZq67\nM9xXHfqvBIMzrSmkWPoISvBnmpSTWPVKmAW8mu697tIpVVBnLOUU8dDTqVSVHnwB\nOe2C3KzoJplgKI9GiuBz2FlU8Ddb3vNfCOm7WHERFUP46eCYZoAA+0mBOP5QkP1E\nSi/HJRk3g7JKAt+wkCFgaBgTI0ad5je0fXTWSA9V3/lKWJbJd2vJbDvuTeMLFZWR\nfrQmEdTT9FQH1EVzwwd9eJkkCU/0MCkJRIxt5Q1bEQKBgQD9LMUL4t9sj/WcZ8kB\njZn+o29BQIQjO5YIa2m9B/KGPyXSE2TvInaYd1SC3glknRkEYF295AS+U/oRpk2f\n9FHcXcTMhA6akca6nTJl7vyTRlLCsGeYMFEydsXvI7YTDpROuDo9vnmrOeQwVWU3\nEi7oxD+CPaR+y9hXPOljkeVkrQKBgQDPvUe55hM5GxEovNjURQCML1g0D3za0E83\nNhIHm5KBMNHjghbzmBu0tvkm/RrXIDi2/UwPkDABdDlAKxfBftQ92R4DAcqFnFyB\nsAMU6VCGn+NXYTmxgpZPyb8ujyAGUFIaxtf253xfCbu6OjIPttciFKM6Df3fBsiZ\nMmxSwGxy9QKBgQC4ihuPEG2+2igzO0s+wJJRE5wSug4XCGXR+Ul3qgVTaVAOEmju\nDfbYJ5MIWQQLvJ7xm7R4p231tYx/tPK79wB8WjUKxe9HJ57tg4uq1Upxpz7H/oFk\nY0OsPvsD1snulh/wSUTaoK5a6rWzrWs7exuKOxH3wyrV6Yvl+tY756qHeQKBgQCV\naJ4Qrs/+j2AM+527NZGKQXbfoo/61D1VCTd4b0S0VAdw6JxXQHwUwlB54SoPtSX1\nPkIZI2vTb+LJKvUf/nbpsKEsKnqdE/NYdt4QiSmYWaBptQyIhdJTulcdRmUTBWu3\nxHGJK75AoEB7VOWydZ9O7Kbk1zFS2Y8m16Qe9DRLjQKBgCmQT67V6kEdaRO2LTwX\ncVcBB8TW135hhx1kNRpbyM/3qjtSajjubOSHZv1NWjRXUQkxQ2Nbvzuwy/yB3Eu2\nLc/EeclU2o7M0N8xr1hbgxgpqqZ09yFErSd9YF23C/afcmL4ePNTF/X5sV9rdt2S\na8LA/1QpOzwUeJgjfVN7QS2s\n-----END PRIVATE KEY-----\n',
            }),
            databaseURL: 'https://nest-core-system.firebaseio.com',
        });
    }
}
