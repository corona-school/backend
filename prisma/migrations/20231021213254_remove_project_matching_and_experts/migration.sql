/* MANUAL */
DELETE FROM "log" WHERE 
 "logtype" IN ('projectMatchDissolve', 'updateProjectFields', 'contactExpert');

/* GENERATED */
/*
  Warnings:

  - The values [projectMatchDissolve,updateProjectFields,contactExpert] on the enum `log_logtype_enum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isJufoParticipant` on the `pupil` table. All the data in the column will be lost.
  - You are about to drop the column `isProjectCoachee` on the `pupil` table. All the data in the column will be lost.
  - You are about to drop the column `openProjectMatchRequestCount` on the `pupil` table. All the data in the column will be lost.
  - You are about to drop the column `projectFields` on the `pupil` table. All the data in the column will be lost.
  - You are about to drop the column `projectMemberCount` on the `pupil` table. All the data in the column will be lost.
  - You are about to drop the column `hasJufoCertificate` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `isProjectCoach` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `jufoPastParticipationConfirmed` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `jufoPastParticipationInfo` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `lastSentJufoAlumniScreeningInvitationDate` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `module` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `moduleHours` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `openProjectMatchRequestCount` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `sentJufoAlumniScreeningReminderCount` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `wasJufoParticipant` on the `student` table. All the data in the column will be lost.
  - You are about to drop the `expert_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `expert_data_expertise_tags_expertise_tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `expertise_tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mentor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_coaching_screening` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_field_with_grade_restriction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_match` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "log_logtype_enum_new" AS ENUM ('misc', 'verificationRequets', 'verified', 'matchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest', 'cocCancel', 'cancelledCourse', 'cancelledSubcourse', 'createdCourseAttendanceLog', 'contactMentor', 'bbbMeeting', 'participantJoinedCourse', 'participantLeftCourse', 'participantJoinedWaitingList', 'participantLeftWaitingList', 'userAccessedCourseWhileAuthenticated', 'instructorIssuedCertificate', 'pupilInterestConfirmationRequestSent', 'pupilInterestConfirmationRequestReminderSent', 'pupilInterestConfirmationRequestStatusChange');
ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT;
ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum_new" USING ("logtype"::text::"log_logtype_enum_new");
ALTER TYPE "log_logtype_enum" RENAME TO "log_logtype_enum_old";
ALTER TYPE "log_logtype_enum_new" RENAME TO "log_logtype_enum";
DROP TYPE "log_logtype_enum_old";
ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc';
COMMIT;

-- DropForeignKey
ALTER TABLE "expert_data" DROP CONSTRAINT "FK_0bf0d1a1e138fd47f60e2635247";

-- DropForeignKey
ALTER TABLE "expert_data_expertise_tags_expertise_tag" DROP CONSTRAINT "FK_73044a211048e72c2026425c81c";

-- DropForeignKey
ALTER TABLE "expert_data_expertise_tags_expertise_tag" DROP CONSTRAINT "FK_8a81e80d1d580b868ed36ca1234";

-- DropForeignKey
ALTER TABLE "project_coaching_screening" DROP CONSTRAINT "FK_565d757e2fd9a97fc3f30f51297";

-- DropForeignKey
ALTER TABLE "project_coaching_screening" DROP CONSTRAINT "FK_91fa06e6e9aa04b5da93d034cae";

-- DropForeignKey
ALTER TABLE "project_field_with_grade_restriction" DROP CONSTRAINT "FK_8cdc7fe37faa309976893b8ad07";

-- DropForeignKey
ALTER TABLE "project_match" DROP CONSTRAINT "FK_2f269fd77a19a301eb7c9aaa6b6";

-- DropForeignKey
ALTER TABLE "project_match" DROP CONSTRAINT "FK_ec8c8527004e4b21fa92dfde9f4";

-- AlterTable
ALTER TABLE "pupil" DROP COLUMN "isJufoParticipant",
DROP COLUMN "isProjectCoachee",
DROP COLUMN "openProjectMatchRequestCount",
DROP COLUMN "projectFields",
DROP COLUMN "projectMemberCount";

-- AlterTable
ALTER TABLE "student" DROP COLUMN "hasJufoCertificate",
DROP COLUMN "isProjectCoach",
DROP COLUMN "jufoPastParticipationConfirmed",
DROP COLUMN "jufoPastParticipationInfo",
DROP COLUMN "lastSentJufoAlumniScreeningInvitationDate",
DROP COLUMN "module",
DROP COLUMN "moduleHours",
DROP COLUMN "openProjectMatchRequestCount",
DROP COLUMN "sentJufoAlumniScreeningReminderCount",
DROP COLUMN "wasJufoParticipant";

-- DropTable
DROP TABLE "expert_data";

-- DropTable
DROP TABLE "expert_data_expertise_tags_expertise_tag";

-- DropTable
DROP TABLE "expertise_tag";

-- DropTable
DROP TABLE "mentor";

-- DropTable
DROP TABLE "project_coaching_screening";

-- DropTable
DROP TABLE "project_field_with_grade_restriction";

-- DropTable
DROP TABLE "project_match";

-- DropEnum
DROP TYPE "expert_data_allowed_enum";

-- DropEnum
DROP TYPE "mentor_division_enum";

-- DropEnum
DROP TYPE "mentor_expertise_enum";

-- DropEnum
DROP TYPE "project_field_with_grade_restriction_projectfield_enum";

-- DropEnum
DROP TYPE "pupil_projectfields_enum";
