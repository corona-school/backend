/*
  Warnings:

  - A unique constraint covering the columns `[appointmentStatsId]` on the table `lecture` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "lecture" ADD COLUMN     "appointmentStatsId" INTEGER;

-- CreateTable
CREATE TABLE "appointment_stats" (
    "id" SERIAL NOT NULL,
    "joinedPupilsCount" INTEGER NOT NULL,
    "joinedStudentsCount" INTEGER NOT NULL,
    "meetingDuration" INTEGER NOT NULL,

    CONSTRAINT "appointment_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lecture_appointmentStatsId_key" ON "lecture"("appointmentStatsId");

-- AddForeignKey
ALTER TABLE "lecture" ADD CONSTRAINT "lecture_appointmentStatsId_fkey" FOREIGN KEY ("appointmentStatsId") REFERENCES "appointment_stats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
