/*
  Warnings:

  - You are about to drop the column `success` on the `instructor_screening` table. All the data in the column will be lost.
  - You are about to drop the column `success` on the `screening` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "instructor_screening" DROP COLUMN "success";

-- AlterTable
ALTER TABLE "screening" DROP COLUMN "success";
