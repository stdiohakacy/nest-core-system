import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAccessToken1690562467405 implements MigrationInterface {
    name = 'CreateTableAccessToken1690562467405';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "access_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "token" character varying NOT NULL, "userId" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'active', CONSTRAINT "PK_65140f59763ff994a0252488166" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "userId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "role_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "permissionId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "name" character varying NOT NULL, CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "type"`);
        await queryRunner.query(
            `ALTER TABLE "roles" DROP COLUMN "description"`
        );
        await queryRunner.query(
            `ALTER TABLE "loggers" ALTER COLUMN "type" SET DEFAULT 'user'`
        );
        await queryRunner.query(
            `ALTER TABLE "roles" ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name")`
        );
        await queryRunner.query(
            `ALTER TABLE "access_tokens" ADD CONSTRAINT "FK_343a101d109c86071f2b2fb43e7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c"`
        );
        await queryRunner.query(
            `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd"`
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`
        );
        await queryRunner.query(
            `ALTER TABLE "access_tokens" DROP CONSTRAINT "FK_343a101d109c86071f2b2fb43e7"`
        );
        await queryRunner.query(
            `ALTER TABLE "roles" DROP CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7"`
        );
        await queryRunner.query(
            `ALTER TABLE "loggers" ALTER COLUMN "type" SET DEFAULT 'USER'`
        );
        await queryRunner.query(
            `ALTER TABLE "roles" ADD "description" character varying`
        );
        await queryRunner.query(
            `ALTER TABLE "roles" ADD "type" character varying NOT NULL DEFAULT 'USER'`
        );
        await queryRunner.query(
            `ALTER TABLE "roles" ADD "isActive" boolean NOT NULL`
        );
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "access_tokens"`);
    }
}
