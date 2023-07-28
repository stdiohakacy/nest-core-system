import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AES, enc, mode, pad } from 'crypto-js';
import { IHelperEncryptionService } from '../interfaces/helper.encryption-service.interface';
import {
    IHelperJwtOptions,
    IHelperJwtVerifyOptions,
} from '../interfaces/helper.interface';
import { HelperDateService } from './helper.date.service';
import { AccessTokenRepository } from '../../../modules/access-token/repositories/access-token.repository';

@Injectable()
export class HelperEncryptionService implements IHelperEncryptionService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly helperDateService: HelperDateService,
        private readonly accessTokenRepo: AccessTokenRepository
    ) {}

    base64Encrypt(data: string): string {
        const buff: Buffer = Buffer.from(data, 'utf8');
        return buff.toString('base64');
    }

    base64Decrypt(data: string): string {
        const buff: Buffer = Buffer.from(data, 'base64');
        return buff.toString('utf8');
    }

    base64Compare(clientBasicToken: string, ourBasicToken: string): boolean {
        return ourBasicToken === clientBasicToken;
    }

    aes256Encrypt(
        data: string | Record<string, any> | Record<string, any>[],
        key: string,
        iv: string
    ): string {
        const cIv = enc.Utf8.parse(iv);
        const cipher = AES.encrypt(JSON.stringify(data), key, {
            mode: mode.CBC,
            padding: pad.Pkcs7,
            iv: cIv,
        });

        return cipher.toString();
    }

    aes256Decrypt(
        encrypted: string,
        key: string,
        iv: string
    ): string | Record<string, any> | Record<string, any>[] {
        const cIv = enc.Utf8.parse(iv);
        const cipher = AES.decrypt(encrypted, key, {
            mode: mode.CBC,
            padding: pad.Pkcs7,
            iv: cIv,
        });

        return JSON.parse(cipher.toString(enc.Utf8));
    }

    jwtEncrypt(
        payload: Record<string, any>,
        options: IHelperJwtOptions
    ): string {
        return this.jwtService.sign(payload, {
            secret: options.secretKey,
            expiresIn: options.expiredIn,
            notBefore: options.notBefore ?? 0,
            audience: options.audience,
            issuer: options.issuer,
            subject: options.subject,
        });
    }

    jwtDecrypt(token: string): Record<string, any> {
        return this.jwtService.decode(token) as Record<string, any>;
    }

    async jwtVerify(
        token: string,
        options: IHelperJwtVerifyOptions
    ): Promise<boolean> {
        try {
            const decodedToken = this.jwtService.verify(token, {
                secret: options.secretKey,
                audience: options.audience,
                issuer: options.issuer,
                subject: options.subject,
            });

            if (decodedToken.exp >= this.helperDateService.create()) {
                await this.accessTokenRepo.revokeByToken(token);
                return false;
            }
            return true;
        } catch (err: unknown) {
            return false;
        }
    }
}
