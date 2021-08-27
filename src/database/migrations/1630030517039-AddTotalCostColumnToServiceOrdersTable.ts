import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTotalCostColumnToServiceOrdersTable1630030517039
  implements MigrationInterface {
  name = 'AddTotalCostColumnToServiceOrdersTable1630030517039';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_orders" ADD "total_cost" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_orders" DROP COLUMN "total_cost"`,
    );
  }
}
