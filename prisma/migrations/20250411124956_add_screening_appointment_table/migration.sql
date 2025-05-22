-- CreateTable
CREATE TABLE "screening_appointment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startAt" TIMESTAMP(6) NOT NULL,
    "cancelledAt" TIMESTAMP(6),
    "cancellationReason" VARCHAR,
    "joinUrl" VARCHAR,
    "eventUrl" VARCHAR,
    "pupilScreeningId" INTEGER,
    "tutorScreeningId" INTEGER,
    "instructorScreeningId" INTEGER,

    CONSTRAINT "screening_appointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "screening_appointment" ADD CONSTRAINT "screening_appointment_pupilScreeningId_fkey" FOREIGN KEY ("pupilScreeningId") REFERENCES "pupil_screening"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "screening_appointment" ADD CONSTRAINT "screening_appointment_tutorScreeningId_fkey" FOREIGN KEY ("tutorScreeningId") REFERENCES "screening"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "screening_appointment" ADD CONSTRAINT "screening_appointment_instructorScreeningId_fkey" FOREIGN KEY ("instructorScreeningId") REFERENCES "instructor_screening"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
