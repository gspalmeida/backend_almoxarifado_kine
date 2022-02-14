import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedSOManPowerCostAndDisplacementCostToFloat1644876306488
  implements MigrationInterface {
  name = 'ChangedSOManPowerCostAndDisplacementCostToFloat1644876306488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_orders" DROP COLUMN "man_power_cost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_orders" ADD "man_power_cost" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_orders" DROP COLUMN "displacement_cost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_orders" ADD "displacement_cost" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_orders" DROP COLUMN "displacement_cost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_orders" ADD "displacement_cost" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_orders" DROP COLUMN "man_power_cost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_orders" ADD "man_power_cost" integer`,
    );
  }
}
