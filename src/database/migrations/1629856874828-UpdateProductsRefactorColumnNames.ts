import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductsRefactorColumnNames1629856874828
  implements MigrationInterface {
  name = 'UpdateProductsRefactorColumnNames1629856874828';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "qty_stock_limit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "unit_last_cost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "max_stock_limit" integer`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "products"."unit_cost" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "products"."unit_cost" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "max_stock_limit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "unit_last_cost" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "qty_stock_limit" integer`,
    );
  }
}
