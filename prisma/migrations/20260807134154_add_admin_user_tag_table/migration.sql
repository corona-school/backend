-- AlterTable
ALTER TABLE "student" ADD COLUMN     "furtherTrainingsAttendedCount" INTEGER DEFAULT 0,
ADD COLUMN     "maxParallelMatches" INTEGER;

-- CreateTable
CREATE TABLE "admin_user_flag" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "flag" VARCHAR NOT NULL,
    "metadata" JSON,

    CONSTRAINT "admin_user_flag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_user_flag_userId_flag_key" ON "admin_user_flag"("userId", "flag");
