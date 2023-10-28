/*
  Warnings:

  - Added the required column `name` to the `cooperation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cooperation" ADD COLUMN     "name" TEXT NOT NULL;
