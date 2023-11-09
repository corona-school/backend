/*
  Warnings:

  - You are about to drop the `subcourse_waiting_list_pupil` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "subcourse_waiting_list_pupil" DROP CONSTRAINT "FK_3bd25f377afc44f574f7ac3d09b";

-- DropForeignKey
ALTER TABLE "subcourse_waiting_list_pupil" DROP CONSTRAINT "FK_df9eb9663f8085da35f7ca55471";

-- DropTable
DROP TABLE "subcourse_waiting_list_pupil";
