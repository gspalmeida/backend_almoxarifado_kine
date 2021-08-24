import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeMeasureUnitNames1629774522739 implements MigrationInterface {
    name = 'ChangeMeasureUnitNames1629774522739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_e12c6872ccf68264bc4105f4a42"`);
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "unitMeasureId" TO "measureUnitId"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_a2655119ea5dde7c28e3f908bc5" FOREIGN KEY ("measureUnitId") REFERENCES "units_of_measure"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_a2655119ea5dde7c28e3f908bc5"`);
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "measureUnitId" TO "unitMeasureId"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_e12c6872ccf68264bc4105f4a42" FOREIGN KEY ("unitMeasureId") REFERENCES "units_of_measure"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
