-- CreateEnum
CREATE TYPE "student_screening_status_enum" AS ENUM ('0', '1', '2', '3');

-- AlterTable
ALTER TABLE "instructor_screening" ADD COLUMN     "status" "student_screening_status_enum" NOT NULL DEFAULT '0';

-- AlterTable
ALTER TABLE "screening" ADD COLUMN     "status" "student_screening_status_enum" NOT NULL DEFAULT '0';
