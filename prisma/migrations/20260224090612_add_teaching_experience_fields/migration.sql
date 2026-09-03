-- CreateEnum
CREATE TYPE "student_jobstatus_enum" AS ENUM ('Student', 'Pupil', 'Employee', 'Retiree', 'Misc', 'Azubi');

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "formalEducation" TEXT,
ADD COLUMN     "jobStatus" "student_jobstatus_enum",
ADD COLUMN     "specialTeachingExperience" TEXT[] DEFAULT ARRAY[]::TEXT[];
