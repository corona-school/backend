-- AlterTable
ALTER TABLE "lecture" ADD COLUMN     "joinedBy" TEXT[] DEFAULT ARRAY[]::TEXT[];
