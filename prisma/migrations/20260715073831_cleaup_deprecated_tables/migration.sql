/*
  Warnings:

  - The values [createdCourseAttendanceLog,bbbMeeting] on the enum `log_logtype_enum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `bbb_meeting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_attendance_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_guest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_participation_certificate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jufo_verification_transmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "log_logtype_enum_new" AS ENUM ('misc', 'verificationRequets', 'verified', 'matchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest', 'cocCancel', 'cancelledCourse', 'cancelledSubcourse', 'participantJoinedCourse', 'participantLeftCourse', 'mentorJoinedCourse', 'mentorAddedToCourse', 'mentorLeftCourse', 'participantJoinedWaitingList', 'participantLeftWaitingList', 'userAccessedCourseWhileAuthenticated', 'instructorIssuedCertificate', 'pupilInterestConfirmationRequestSent', 'pupilInterestConfirmationRequestReminderSent', 'pupilInterestConfirmationRequestStatusChange', 'skippedCoC');
ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT;
ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum_new" USING ("logtype"::text::"log_logtype_enum_new");
ALTER TYPE "log_logtype_enum" RENAME TO "log_logtype_enum_old";
ALTER TYPE "log_logtype_enum_new" RENAME TO "log_logtype_enum";
DROP TYPE "log_logtype_enum_old";
ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc';
COMMIT;

-- DropForeignKey
ALTER TABLE "course_attendance_log" DROP CONSTRAINT "FK_927959c3480126ecdceeae26609";

-- DropForeignKey
ALTER TABLE "course_attendance_log" DROP CONSTRAINT "FK_acc59dc4321a888376f7fad5a3d";

-- DropForeignKey
ALTER TABLE "course_guest" DROP CONSTRAINT "FK_4392726b6462358a809db822af4";

-- DropForeignKey
ALTER TABLE "course_guest" DROP CONSTRAINT "FK_a0843258a46daa7d91dc2cef917";

-- DropForeignKey
ALTER TABLE "course_participation_certificate" DROP CONSTRAINT "FK_585aa209315fc328d48af2765b4";

-- DropForeignKey
ALTER TABLE "course_participation_certificate" DROP CONSTRAINT "FK_bc6a26ac82132b6e9f1d6de3e4c";

-- DropForeignKey
ALTER TABLE "course_participation_certificate" DROP CONSTRAINT "FK_d03c3421018dd300f5e9061ae87";

-- DropForeignKey
ALTER TABLE "jufo_verification_transmission" DROP CONSTRAINT "FK_1ceddec34e7b90cdbb85ff9738f";

-- DropTable
DROP TABLE "bbb_meeting";

-- DropTable
DROP TABLE "course_attendance_log";

-- DropTable
DROP TABLE "course_guest";

-- DropTable
DROP TABLE "course_participation_certificate";

-- DropTable
DROP TABLE "jufo_verification_transmission";
