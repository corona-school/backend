-- AlterTable
ALTER TABLE "pupil" ADD COLUMN     "systemMessagesForScreening" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "systemMessagesForScreening" TEXT[] DEFAULT ARRAY[]::TEXT[];
