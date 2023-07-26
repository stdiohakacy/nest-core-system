import { MigrationInterface, QueryRunner } from 'typeorm';

export class UdpateColumnTableUser1690357142007 implements MigrationInterface {
    name = 'UdpateColumnTableUser1690357142007';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`
        );
    }
}
