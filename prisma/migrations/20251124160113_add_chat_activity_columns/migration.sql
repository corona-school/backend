-- AlterTable
ALTER TABLE "match" ADD COLUMN     "pupilFirstMessageSentAt" TIMESTAMP(6),
ADD COLUMN     "pupilLastMessageSentAt" TIMESTAMP(6),
ADD COLUMN     "studentFirstMessageSentAt" TIMESTAMP(6),
ADD COLUMN     "studentLastMessageSentAt" TIMESTAMP(6);
