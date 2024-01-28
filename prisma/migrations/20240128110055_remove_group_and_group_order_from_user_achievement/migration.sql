/*
  Warnings:

  - You are about to drop the column `group` on the `user_achievement` table. All the data in the column will be lost.
  - You are about to drop the column `groupOrder` on the `user_achievement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_achievement" DROP COLUMN "group",
DROP COLUMN "groupOrder";
