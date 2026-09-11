-- AlterTable
ALTER TABLE "instructor_screening" ADD COLUMN     "decisionTakenAt" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "pupil_screening" ADD COLUMN     "decisionTakenAt" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "screening" ADD COLUMN     "decisionTakenAt" TIMESTAMP(6);
