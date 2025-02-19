-- CreateTable
CREATE TABLE "instant_certificate" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uuid" VARCHAR NOT NULL,
    "studentId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "matchesCount" INTEGER NOT NULL,
    "matchAppointmentsCount" INTEGER NOT NULL,
    "courseParticipantsCount" INTEGER NOT NULL,
    "courseAppointmentsCount" INTEGER NOT NULL,
    "totalAppointmentsDuration" INTEGER NOT NULL,

    CONSTRAINT "instant_certificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instant_certificate_uuid_key" ON "instant_certificate"("uuid");

-- AddForeignKey
ALTER TABLE "instant_certificate" ADD CONSTRAINT "instant_certificate_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
