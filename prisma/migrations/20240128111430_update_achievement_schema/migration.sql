-- DropIndex
DROP INDEX "user_achievement_group_key";
/*
  Warnings:

  - You are about to drop the column `metrics` on the `achievement_template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "achievement_template" DROP COLUMN "metrics";
/*
  Warnings:

  - Added the required column `achievedImage` to the `achievement_template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "achievement_template" ADD COLUMN     "achievedImage" VARCHAR NOT NULL;
/*
  Warnings:

  - You are about to drop the column `group` on the `user_achievement` table. All the data in the column will be lost.
  - You are about to drop the column `groupOrder` on the `user_achievement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_achievement" DROP COLUMN "group",
DROP COLUMN "groupOrder";
-- AlterTable
ALTER TABLE "user_achievement" ADD COLUMN     "relation" TEXT;
-- CreateIndex
CREATE UNIQUE INDEX "user_achievement_relation_userId_templateId_key" ON "user_achievement"("relation", "userId", "templateId");
