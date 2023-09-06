-- CreateEnum
CREATE TYPE "dissolved_by_enum" AS ENUM ('pupil', 'student', 'admin');

-- AlterTable
ALTER TABLE "match" ADD COLUMN     "dissolvedBy" "dissolved_by_enum";
