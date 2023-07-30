import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnTableUser1690716553539 implements MigrationInterface {
    name = 'UpdateColumnTableUser1690716553539';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD "isPhoneConfirmation" boolean DEFAULT false`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "isPhoneConfirmation"`
        );
    }
}
