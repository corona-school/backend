/*
  Warnings:

  - The values [contactMentor] on the enum `log_logtype_enum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "log_logtype_enum_new" AS ENUM ('misc', 'verificationRequets', 'verified', 'matchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest', 'cocCancel', 'cancelledCourse', 'cancelledSubcourse', 'createdCourseAttendanceLog', 'bbbMeeting', 'participantJoinedCourse', 'participantLeftCourse', 'mentorJoinedCourse', 'mentorLeftCourse', 'participantJoinedWaitingList', 'participantLeftWaitingList', 'userAccessedCourseWhileAuthenticated', 'instructorIssuedCertificate', 'pupilInterestConfirmationRequestSent', 'pupilInterestConfirmationRequestReminderSent', 'pupilInterestConfirmationRequestStatusChange', 'skippedCoC');
ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT;
ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum_new" USING ("logtype"::text::"log_logtype_enum_new");
ALTER TYPE "log_logtype_enum" RENAME TO "log_logtype_enum_old";
ALTER TYPE "log_logtype_enum_new" RENAME TO "log_logtype_enum";
DROP TYPE "log_logtype_enum_old";
ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc';
COMMIT;

-- CreateTable
CREATE TABLE "subcourse_mentors_student" (
    "subcourseId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "subcourse_mentors_student_pkey" PRIMARY KEY ("subcourseId","studentId")
);

-- AddForeignKey
ALTER TABLE "subcourse_mentors_student" ADD CONSTRAINT "subcourse_mentors_student_subcourseId_fkey" FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcourse_mentors_student" ADD CONSTRAINT "subcourse_mentors_student_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
