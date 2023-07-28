import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnTableUser1690520218336 implements MigrationInterface {
    name = 'UpdateColumnTableUser1690520218336';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD "activeKey" character varying`
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "activeExpire" TIMESTAMP WITH TIME ZONE`
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "activatedAt" TIMESTAMP WITH TIME ZONE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "activatedAt"`
        );
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "activeExpire"`
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "activeKey"`);
    }
}
