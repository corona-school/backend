/*
  Warnings:

  - Added the required column `keys` to the `push_subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "push_subscription" ADD COLUMN     "keys" JSONB NOT NULL;
