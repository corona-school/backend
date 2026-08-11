-- AlterTable
ALTER TABLE "student" ADD COLUMN     "furtherTrainingsAttendedCount" INTEGER DEFAULT 0,
ADD COLUMN     "maxParallelMatches" INTEGER,
ADD COLUMN     "screeningTags" VARCHAR[] DEFAULT ARRAY[]::VARCHAR[];
