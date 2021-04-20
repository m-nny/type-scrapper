import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1618625657999 implements MigrationInterface {
    public name = 'Init1618625657999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "instagram_user" ("username" character varying NOT NULL, "avatarUrl" character varying NOT NULL, "importDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_30a1a7c220192d9eeedad082a60" PRIMARY KEY ("username"))`);
        await queryRunner.query(`CREATE TABLE "instagram_image" ("id" character varying NOT NULL, "url" character varying NOT NULL, "authorUsername" character varying, CONSTRAINT "PK_da5cdf68eb2d5255ec525533151" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "instagram_image" ADD CONSTRAINT "FK_f3fe43c6f4a137275028a6437fa" FOREIGN KEY ("authorUsername") REFERENCES "instagram_user"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instagram_image" DROP CONSTRAINT "FK_f3fe43c6f4a137275028a6437fa"`);
        await queryRunner.query(`DROP TABLE "instagram_image"`);
        await queryRunner.query(`DROP TABLE "instagram_user"`);
    }

}
