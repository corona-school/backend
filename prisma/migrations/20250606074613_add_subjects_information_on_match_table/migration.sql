-- AlterTable
ALTER TABLE "match" ADD COLUMN     "subjectsAtMatchingTime" JSON[] DEFAULT ARRAY[]::JSON[];
