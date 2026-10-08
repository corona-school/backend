-- CreateEnum
CREATE TYPE "internship_status_enum" AS ENUM ('in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "internship" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "internship_status_enum" NOT NULL DEFAULT 'in_progress',
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "internship_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "internship" ADD CONSTRAINT "internship_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
