import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnTableUser1690537698447 implements MigrationInterface {
    name = 'UpdateColumnTableUser1690537698447';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD "forgotKey" character varying`
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "forgotExpire" TIMESTAMP WITH TIME ZONE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "forgotExpire"`
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "forgotKey"`);
    }
}
