import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1690356285824 implements MigrationInterface {
    name = 'Initial1690356285824';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "api-keys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "type" character varying NOT NULL DEFAULT 'PUBLIC', "name" character varying NOT NULL, "key" character varying NOT NULL, "hash" character varying NOT NULL, "isActive" boolean NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_ac5d2f5c3b3336bf6ef21044829" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "name" character varying NOT NULL, "type" character varying NOT NULL, "value" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "loggers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "level" character varying NOT NULL DEFAULT 'DEBUG', "action" character varying NOT NULL DEFAULT 'TEST', "method" character varying NOT NULL DEFAULT 'GET', "anonymous" boolean NOT NULL DEFAULT false, "description" character varying NOT NULL DEFAULT '', "tags" jsonb NOT NULL DEFAULT '[]', "requestId" uuid, "userId" uuid, "apiKeyId" uuid, "type" character varying NOT NULL DEFAULT 'USER', "params" jsonb NOT NULL DEFAULT '{}', "bodies" jsonb NOT NULL DEFAULT '{}', "statusCode" integer NOT NULL DEFAULT '200', "path" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_29e8f8af58645b7a782e3694a1a" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "name" character varying NOT NULL, "isActive" boolean NOT NULL, "type" character varying NOT NULL DEFAULT 'USER', "description" character varying, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "username" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "passwordExpired" TIMESTAMP WITH TIME ZONE NOT NULL, "passwordCreated" TIMESTAMP WITH TIME ZONE NOT NULL, "passwordAttempt" integer NOT NULL, "signUpDate" TIMESTAMP WITH TIME ZONE NOT NULL, "signUpFrom" character varying NOT NULL DEFAULT 'LOCAL', "salt" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "inactivePermanent" boolean NOT NULL, "blocked" boolean NOT NULL, "inactiveDate" TIMESTAMP WITH TIME ZONE, "blockedDate" TIMESTAMP WITH TIME ZONE, "photo" jsonb, "google" jsonb, "mobileNumber" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "loggers"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP TABLE "api-keys"`);
    }
}
