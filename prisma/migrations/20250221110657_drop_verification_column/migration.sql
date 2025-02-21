/*
  Warnings:

  - You are about to drop the column `verification` on the `pupil` table. All the data in the column will be lost.
  - You are about to drop the column `verification` on the `screener` table. All the data in the column will be lost.
  - You are about to drop the column `verification` on the `student` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "IDX_90fde657ec008e61a5b07947b3";

-- DropIndex
DROP INDEX "IDX_c9e25ecca022d0d6cd401d9e5e";

-- DropIndex
DROP INDEX "IDX_34cbafcb0bcdfb2b6de9010acb";

-- AlterTable
ALTER TABLE "pupil" DROP COLUMN "verification";

-- AlterTable
ALTER TABLE "screener" DROP COLUMN "verification";

-- AlterTable
ALTER TABLE "student" DROP COLUMN "verification";
