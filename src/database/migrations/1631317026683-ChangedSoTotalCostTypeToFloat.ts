import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedSoTotalCostTypeToFloat1631317026683 implements MigrationInterface {
    name = 'ChangedSoTotalCostTypeToFloat1631317026683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_orders" DROP COLUMN "total_cost"`);
        await queryRunner.query(`ALTER TABLE "service_orders" ADD "total_cost" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_orders" DROP COLUMN "total_cost"`);
        await queryRunner.query(`ALTER TABLE "service_orders" ADD "total_cost" integer`);
    }

}
