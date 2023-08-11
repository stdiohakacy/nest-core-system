import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1691774882561 implements MigrationInterface {
    name = 'Initial1691774882561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "lastTime"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "lastMessage"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "user_conversations" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_conversations" ADD "lastMessage" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_conversations" ADD "lastTime" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_conversations" DROP COLUMN "lastTime"`);
        await queryRunner.query(`ALTER TABLE "user_conversations" DROP COLUMN "lastMessage"`);
        await queryRunner.query(`ALTER TABLE "user_conversations" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "lastMessage" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "lastTime" TIMESTAMP NOT NULL`);
    }

}
