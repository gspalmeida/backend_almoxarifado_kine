import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeUnrequiredColumnsOfServiceOrdersNullable1630037551823
  implements MigrationInterface {
  name = 'MakeUnrequiredColumnsOfServiceOrdersNullable1630037551823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_orders" ALTER COLUMN "man_power_cost" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_orders" ALTER COLUMN "displacement_cost" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_orders" ALTER COLUMN "displacement_cost" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_orders" ALTER COLUMN "man_power_cost" SET NOT NULL`,
    );
  }
}
