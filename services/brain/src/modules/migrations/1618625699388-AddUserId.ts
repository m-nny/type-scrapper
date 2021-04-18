import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserId1618625699388 implements MigrationInterface {
    name = 'AddUserId1618625699388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instagram_user" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "instagram_user" ADD CONSTRAINT "UQ_905373de700f1eefe4ea7e9e9f3" UNIQUE ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instagram_user" DROP CONSTRAINT "UQ_905373de700f1eefe4ea7e9e9f3"`);
        await queryRunner.query(`ALTER TABLE "instagram_user" DROP COLUMN "id"`);
    }

}
