/*
  Warnings:

  - You are about to drop the column `dissolveReason` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `dissolveReasonEnum` on the `match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "match" DROP COLUMN "dissolveReason",
DROP COLUMN "dissolveReasonEnum";
