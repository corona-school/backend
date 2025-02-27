-- AlterTable
ALTER TABLE "screener" ADD COLUMN     "is_course_screener" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_pupil_screener" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_student_screener" BOOLEAN NOT NULL DEFAULT false;
