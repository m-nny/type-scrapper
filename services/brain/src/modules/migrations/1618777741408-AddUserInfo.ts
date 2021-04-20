import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserInfo1618777741408 implements MigrationInterface {
    public name = 'AddUserInfo1618777741408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "instagram_user_info" ("id" character varying NOT NULL, "avatarUrl" character varying NOT NULL, "importDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7c65b982791b6fed9c60f98eddb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "instagram_user" DROP COLUMN "avatarUrl"`);
        await queryRunner.query(`ALTER TABLE "instagram_user" DROP COLUMN "importDate"`);
        await queryRunner.query(`ALTER TABLE "instagram_user" ALTER COLUMN "id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "instagram_user" ADD CONSTRAINT "FK_905373de700f1eefe4ea7e9e9f3" FOREIGN KEY ("id") REFERENCES "instagram_user_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instagram_user" DROP CONSTRAINT "FK_905373de700f1eefe4ea7e9e9f3"`);
        await queryRunner.query(`ALTER TABLE "instagram_user" ALTER COLUMN "id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "instagram_user" ADD "importDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "instagram_user" ADD "avatarUrl" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "instagram_user_info"`);
    }

}
