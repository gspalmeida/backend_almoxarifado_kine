import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductsMakeUnitCostString1629853397866
  implements MigrationInterface {
  name = 'UpdateProductsMakeUnitCostString1629853397866';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "unit_cost"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "unit_cost" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "unit_last_cost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "unit_last_cost" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "unit_last_cost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "unit_last_cost" integer`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "unit_cost"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "unit_cost" bigint NOT NULL`,
    );
  }
}
