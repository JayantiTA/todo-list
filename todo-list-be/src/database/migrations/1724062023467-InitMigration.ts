// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class InitMigration1724062023467 implements MigrationInterface {
//   name = 'InitMigration1724062023467';

//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       `CREATE TABLE "comment" ("id" SERIAL NOT NULL, "content" text NOT NULL, "userId" integer NOT NULL, "taskId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
//     );
//     await queryRunner.query(
//       `CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "status" character varying NOT NULL DEFAULT 'To Do', "dueDate" TIMESTAMP, "userId" integer NOT NULL, "assigneeId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
//     );
//     await queryRunner.query(
//       `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
//     );
//     await queryRunner.query(
//       `ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     );
//     await queryRunner.query(
//       `ALTER TABLE "comment" ADD CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     );
//     await queryRunner.query(
//       `ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     );
//     await queryRunner.query(
//       `ALTER TABLE "task" ADD CONSTRAINT "FK_7384988f7eeb777e44802a0baca" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       `ALTER TABLE "task" DROP CONSTRAINT "FK_7384988f7eeb777e44802a0baca"`,
//     );
//     await queryRunner.query(
//       `ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`,
//     );
//     await queryRunner.query(
//       `ALTER TABLE "comment" DROP CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95"`,
//     );
//     await queryRunner.query(
//       `ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`,
//     );
//     await queryRunner.query(`DROP TABLE "user"`);
//     await queryRunner.query(`DROP TABLE "task"`);
//     await queryRunner.query(`DROP TABLE "comment"`);
//   }
// }
