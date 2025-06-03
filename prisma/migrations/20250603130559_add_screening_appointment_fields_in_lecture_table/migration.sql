-- AlterEnum
ALTER TYPE "lecture_appointmenttype_enum" ADD VALUE 'screening';

-- AlterTable
ALTER TABLE "lecture" ADD COLUMN     "eventUrl" TEXT,
ADD COLUMN     "instructorScreeningId" INTEGER,
ADD COLUMN     "pupilScreeningId" INTEGER,
ADD COLUMN     "tutorScreeningId" INTEGER;

-- AddForeignKey
ALTER TABLE "lecture" ADD CONSTRAINT "lecture_pupilScreeningId_fkey" FOREIGN KEY ("pupilScreeningId") REFERENCES "pupil_screening"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lecture" ADD CONSTRAINT "lecture_tutorScreeningId_fkey" FOREIGN KEY ("tutorScreeningId") REFERENCES "screening"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lecture" ADD CONSTRAINT "lecture_instructorScreeningId_fkey" FOREIGN KEY ("instructorScreeningId") REFERENCES "instructor_screening"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
