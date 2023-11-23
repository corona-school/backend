/*
  Warnings:

  - Added the required column `achievedImage` to the `achievement_template` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_achievement_group_key";

-- AlterTable
ALTER TABLE "achievement_template" ADD COLUMN     "achievedImage" VARCHAR NOT NULL;
