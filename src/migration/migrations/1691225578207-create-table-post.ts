import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePost1691225578207 implements MigrationInterface {
    name = 'CreateTablePost1691225578207';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "title" character varying NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "posts"`);
    }
}
