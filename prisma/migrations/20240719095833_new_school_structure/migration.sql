/*
  Warnings:

  - You are about to drop the column `activeCooperation` on the `school` table. All the data in the column will be lost.
  - You are about to drop the column `emailDomain` on the `school` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `school` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,state,city]` on the table `school` will be added. If there are existing duplicate values, this will fail.
  - Made the column `state` on table `school` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "IDX_b365d0ef66facdfeb842d45683";

-- DropIndex
DROP INDEX "IDX_f3f92f9182a7fccc2858fd63cc";

-- AlterTable
ALTER TABLE "school" DROP COLUMN "activeCooperation",
DROP COLUMN "emailDomain",
DROP COLUMN "website",
ADD COLUMN     "city" VARCHAR,
ADD COLUMN     "email" VARCHAR,
ADD COLUMN     "zip" VARCHAR,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "schooltype" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "school_name_state_city_key" ON "school"("name", "state", "city");
