/*
  Warnings:

  - You are about to drop the column `achievedText` on the `achievement_template` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `achievement_template` table. All the data in the column will be lost.
  - You are about to drop the column `progressDescription` on the `achievement_template` table. All the data in the column will be lost.
  - You are about to drop the column `stepName` on the `achievement_template` table. All the data in the column will be lost.
  - You are about to drop the column `streakProgress` on the `achievement_template` table. All the data in the column will be lost.
  - Added the required column `title` to the `achievement_template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "achievement_template" DROP COLUMN "achievedText",
DROP COLUMN "name",
DROP COLUMN "progressDescription",
DROP COLUMN "stepName",
DROP COLUMN "streakProgress",
ADD COLUMN     "achievedFooter" VARCHAR,
ADD COLUMN     "footer" VARCHAR,
ADD COLUMN     "sequentialStepName" VARCHAR,
ADD COLUMN     "tagline" VARCHAR,
ADD COLUMN     "title" VARCHAR NOT NULL;
