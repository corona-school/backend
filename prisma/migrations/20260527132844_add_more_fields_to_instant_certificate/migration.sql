-- AlterTable
ALTER TABLE "instant_certificate" ADD COLUMN     "isInternship" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalCourseAppointmentDuration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalMatchAppointmentsDuration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trainingDuration" INTEGER NOT NULL DEFAULT 0;
