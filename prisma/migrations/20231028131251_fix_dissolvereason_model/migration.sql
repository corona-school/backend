-- CreateEnum
CREATE TYPE "dissolved_by_enum" AS ENUM ('pupil', 'student', 'admin', 'unknown');

-- CreateEnum
CREATE TYPE "dissolve_reason" AS ENUM ('accountDeactivated', 'ghosted', 'noMoreHelpNeeded', 'isOfNoHelp', 'noMoreTime', 'personalIssues', 'scheduleIssues', 'technicalIssues', 'languageIssues', 'other', 'unknown');

-- AlterTable
ALTER TABLE "match" ADD COLUMN     "dissolveReasonEnum" "dissolve_reason",
ADD COLUMN     "dissolvedBy" "dissolved_by_enum";
