-- CreateEnum
CREATE TYPE "lecture_feedback_status_enum" AS ENUM ('pending', 'submitted', 'dismissed');

-- CreateTable
CREATE TABLE "lecture_feedback" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lectureId" INTEGER,
    "userId" VARCHAR NOT NULL,
    "rating" INTEGER,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "lecture_feedback_status_enum" NOT NULL DEFAULT 'pending',

    CONSTRAINT "lecture_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lecture_feedback_lectureId_userId_key" ON "lecture_feedback"("lectureId", "userId");

-- AddForeignKey
ALTER TABLE "lecture_feedback" ADD CONSTRAINT "lecture_feedback_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "lecture"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
