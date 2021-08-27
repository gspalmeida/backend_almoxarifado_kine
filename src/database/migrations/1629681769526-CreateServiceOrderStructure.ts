import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServiceOrderStructure1629681769526
  implements MigrationInterface {
  name = 'CreateServiceOrderStructure1629681769526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sellers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_97337ccbf692c58e6c7682de8a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "technicians" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b14514b23605f79475be53065b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" character varying NOT NULL, "running" boolean, "completed" boolean, "closed" boolean, "man_power_cost" integer NOT NULL, "displacement_cost" integer NOT NULL, "materials" text NOT NULL, "materials_total_cost" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sellerId" uuid, "clientId" uuid, "technicianId" uuid, CONSTRAINT "PK_914aa74962ee83b10614ea2095d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_orders" ADD CONSTRAINT "FK_0f8d3f5784c043a52ff86469535" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_orders" ADD CONSTRAINT "FK_713947cb05057fe181804e1f164" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_orders" ADD CONSTRAINT "FK_395a4d6cee94b81ef0a9efbf623" FOREIGN KEY ("technicianId") REFERENCES "technicians"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_orders" DROP CONSTRAINT "FK_395a4d6cee94b81ef0a9efbf623"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_orders" DROP CONSTRAINT "FK_713947cb05057fe181804e1f164"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_orders" DROP CONSTRAINT "FK_0f8d3f5784c043a52ff86469535"`,
    );
    await queryRunner.query(`DROP TABLE "clients"`);
    await queryRunner.query(`DROP TABLE "service_orders"`);
    await queryRunner.query(`DROP TABLE "technicians"`);
    await queryRunner.query(`DROP TABLE "sellers"`);
  }
}
