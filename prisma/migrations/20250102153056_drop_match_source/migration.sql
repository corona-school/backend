/*
  Warnings:

  - You are about to drop the column `source` on the `match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "match" DROP COLUMN "source";

-- DropEnum
DROP TYPE "match_source_enum";
