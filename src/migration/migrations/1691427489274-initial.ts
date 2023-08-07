import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1691427489274 implements MigrationInterface {
    name = 'Initial1691427489274';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "loggers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "level" character varying NOT NULL DEFAULT 'DEBUG', "action" character varying NOT NULL DEFAULT 'TEST', "method" character varying NOT NULL DEFAULT 'GET', "anonymous" boolean NOT NULL DEFAULT false, "description" character varying NOT NULL DEFAULT '', "tags" jsonb NOT NULL DEFAULT '[]', "requestId" uuid, "userId" uuid, "apiKeyId" uuid, "type" character varying NOT NULL DEFAULT 'user', "params" jsonb NOT NULL DEFAULT '{}', "bodies" jsonb NOT NULL DEFAULT '{}', "statusCode" integer NOT NULL DEFAULT '200', "path" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_29e8f8af58645b7a782e3694a1a" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "name" character varying NOT NULL, CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "role_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "permissionId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "name" character varying NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "userId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "access_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "token" character varying NOT NULL, "userId" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'active', CONSTRAINT "PK_65140f59763ff994a0252488166" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "userId" uuid NOT NULL, "title" character varying NOT NULL, "body" character varying NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "username" character varying, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "passwordExpired" TIMESTAMP WITH TIME ZONE NOT NULL, "passwordCreated" TIMESTAMP WITH TIME ZONE NOT NULL, "passwordAttempt" integer NOT NULL, "signUpDate" TIMESTAMP WITH TIME ZONE NOT NULL, "signUpFrom" character varying NOT NULL DEFAULT 'LOCAL', "salt" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "inactivePermanent" boolean NOT NULL, "blocked" boolean NOT NULL, "inactiveDate" TIMESTAMP WITH TIME ZONE, "blockedDate" TIMESTAMP WITH TIME ZONE, "photo" jsonb, "google" jsonb, "mobileNumber" character varying, "activeKey" character varying, "activeExpire" TIMESTAMP WITH TIME ZONE, "activatedAt" TIMESTAMP WITH TIME ZONE, "forgotKey" character varying, "forgotExpire" TIMESTAMP WITH TIME ZONE, "isPhoneConfirmation" boolean DEFAULT false, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "devices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "type" character varying NOT NULL, "token" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "api-keys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "type" character varying NOT NULL DEFAULT 'PUBLIC', "name" character varying NOT NULL, "key" character varying NOT NULL, "hash" character varying NOT NULL, "isActive" boolean NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_ac5d2f5c3b3336bf6ef21044829" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "name" character varying NOT NULL, "type" character varying NOT NULL, "value" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "sms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "response" jsonb NOT NULL, CONSTRAINT "PK_60793c2f16aafe0513f8817eae8" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "access_tokens" ADD CONSTRAINT "FK_343a101d109c86071f2b2fb43e7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "devices" ADD CONSTRAINT "FK_e8a5d59f0ac3040395f159507c6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "devices" DROP CONSTRAINT "FK_e8a5d59f0ac3040395f159507c6"`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`
        );
        await queryRunner.query(
            `ALTER TABLE "access_tokens" DROP CONSTRAINT "FK_343a101d109c86071f2b2fb43e7"`
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`
        );
        await queryRunner.query(
            `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c"`
        );
        await queryRunner.query(
            `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd"`
        );
        await queryRunner.query(`DROP TABLE "sms"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP TABLE "api-keys"`);
        await queryRunner.query(`DROP TABLE "devices"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "access_tokens"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "loggers"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }
}
