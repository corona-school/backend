-- AlterTable
ALTER TABLE "match" ADD COLUMN     "pupilMessageCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "studentMessageCount" INTEGER NOT NULL DEFAULT 0;
