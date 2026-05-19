-- CreateEnum
CREATE TYPE "match_request_status" AS ENUM ('open', 'resolved', 'cancelled');

-- CreateTable
CREATE TABLE "match_request" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subjects" JSON[] DEFAULT ARRAY[]::JSON[],
    "status" "match_request_status" NOT NULL DEFAULT 'open',
    "closedAt" TIMESTAMP(3),
    "studentId" INTEGER,
    "pupilId" INTEGER,
    "matchId" INTEGER,

    CONSTRAINT "match_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "match_request" ADD CONSTRAINT "match_request_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match_request" ADD CONSTRAINT "match_request_pupilId_fkey" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match_request" ADD CONSTRAINT "match_request_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
