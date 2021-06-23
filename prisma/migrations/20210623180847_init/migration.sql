-- CreateEnum
CREATE TYPE "course_category_enum" AS ENUM ('revision', 'club', 'coaching');

-- CreateEnum
CREATE TYPE "course_coursestate_enum" AS ENUM ('created', 'submitted', 'allowed', 'denied', 'cancelled');

-- CreateEnum
CREATE TYPE "expert_data_allowed_enum" AS ENUM ('pending', 'yes', 'no');

-- CreateEnum
CREATE TYPE "log_logtype_enum" AS ENUM ('misc', 'verificationRequets', 'verified', 'matchDissolve', 'projectMatchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'updateProjectFields', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest', 'cancelledCourse', 'cancelledSubcourse', 'createdCourseAttendanceLog', 'contactMentor', 'bbbMeeting', 'contactExpert', 'participantJoinedCourse', 'participantLeftCourse', 'participantJoinedWaitingList', 'participantLeftWaitingList', 'userAccessedCourseWhileAuthenticated', 'instructorIssuedCertificate', 'pupilInterestConfirmationRequestSent', 'pupilInterestConfirmationRequestReminderSent', 'pupilInterestConfirmationRequestStatusChange');

-- CreateEnum
CREATE TYPE "match_source_enum" AS ENUM ('imported', 'matchedexternal', 'matchedinternal');

-- CreateEnum
CREATE TYPE "mentor_division_enum" AS ENUM ('facebook', 'email', 'events', 'video', 'supervision');

-- CreateEnum
CREATE TYPE "mentor_expertise_enum" AS ENUM ('language difficulties and communication', 'specialized expertise in subjects', 'educational and didactic expertise', 'technical support', 'self-organization');

-- CreateEnum
CREATE TYPE "project_field_with_grade_restriction_projectfield_enum" AS ENUM ('Arbeitswelt', 'Biologie', 'Chemie', 'Geo-und-Raumwissenschaften', 'Mathematik/Informatik', 'Physik', 'Technik');

-- CreateEnum
CREATE TYPE "pupil_projectfields_enum" AS ENUM ('Arbeitswelt', 'Biologie', 'Chemie', 'Geo-und-Raumwissenschaften', 'Mathematik/Informatik', 'Physik', 'Technik');

-- CreateEnum
CREATE TYPE "pupil_registrationsource_enum" AS ENUM ('0', '1', '2', '3');

-- CreateEnum
CREATE TYPE "pupil_schooltype_enum" AS ENUM ('grundschule', 'gesamtschule', 'hauptschule', 'realschule', 'gymnasium', 'förderschule', 'berufsschule', 'other');

-- CreateEnum
CREATE TYPE "pupil_state_enum" AS ENUM ('bw', 'by', 'be', 'bb', 'hb', 'hh', 'he', 'mv', 'ni', 'nw', 'rp', 'sl', 'sn', 'st', 'sh', 'th', 'other');

-- CreateEnum
CREATE TYPE "school_schooltype_enum" AS ENUM ('grundschule', 'gesamtschule', 'hauptschule', 'realschule', 'gymnasium', 'förderschule', 'berufsschule', 'other');

-- CreateEnum
CREATE TYPE "school_state_enum" AS ENUM ('bw', 'by', 'be', 'bb', 'hb', 'hh', 'he', 'mv', 'ni', 'nw', 'rp', 'sl', 'sn', 'st', 'sh', 'th', 'other');

-- CreateEnum
CREATE TYPE "student_module_enum" AS ENUM ('internship', 'seminar', 'other');

-- CreateEnum
CREATE TYPE "student_registrationsource_enum" AS ENUM ('0', '1', '2', '3');

-- CreateEnum
CREATE TYPE "student_state_enum" AS ENUM ('bw', 'by', 'be', 'bb', 'hb', 'hh', 'he', 'mv', 'ni', 'nw', 'rp', 'sl', 'sn', 'st', 'sh', 'th', 'other');

-- CreateEnum
CREATE TYPE "pupil_languages_enum" AS ENUM ('Albanisch', 'Arabisch', 'Armenisch', 'Aserbaidschanisch', 'Bosnisch', 'Bulgarisch', 'Chinesisch', 'Deutsch', 'Englisch', 'Französisch', 'Italienisch', 'Kasachisch', 'Kurdisch', 'Polnisch', 'Portugiesisch', 'Russisch', 'Türkisch', 'Spanisch', 'Ukrainisch', 'Vietnamesisch', 'Andere');

-- CreateEnum
CREATE TYPE "pupil_learninggermansince_enum" AS ENUM ('>4', '2-4', '1-2', '<1');

-- CreateEnum
CREATE TYPE "student_languages_enum" AS ENUM ('Albanisch', 'Arabisch', 'Armenisch', 'Aserbaidschanisch', 'Bosnisch', 'Bulgarisch', 'Chinesisch', 'Deutsch', 'Englisch', 'Französisch', 'Italienisch', 'Kasachisch', 'Kurdisch', 'Polnisch', 'Portugiesisch', 'Russisch', 'Türkisch', 'Spanisch', 'Ukrainisch', 'Vietnamesisch', 'Andere');

-- CreateTable
CREATE TABLE "bbb_meeting" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meetingID" TEXT NOT NULL,
    "meetingName" TEXT,
    "attendeePW" TEXT,
    "moderatorPW" TEXT,
    "alternativeUrl" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "outline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageKey" TEXT,
    "category" "course_category_enum" NOT NULL,
    "courseState" "course_coursestate_enum" NOT NULL DEFAULT E'created',
    "screeningComment" TEXT,
    "publicRanking" INTEGER NOT NULL DEFAULT 0,
    "allowContact" BOOLEAN NOT NULL DEFAULT false,
    "correspondentId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_attendance_log" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendedTime" INTEGER,
    "ip" TEXT,
    "pupilId" INTEGER,
    "lectureId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_instructors_student" (
    "courseId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    PRIMARY KEY ("courseId","studentId")
);

-- CreateTable
CREATE TABLE "course_tag" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_tags_course_tag" (
    "courseId" INTEGER NOT NULL,
    "courseTagId" INTEGER NOT NULL,

    PRIMARY KEY ("courseId","courseTagId")
);

-- CreateTable
CREATE TABLE "expert_data" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contactEmail" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "allowed" "expert_data_allowed_enum" NOT NULL DEFAULT E'pending',
    "studentId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_data_expertise_tags_expertise_tag" (
    "expertDataId" INTEGER NOT NULL,
    "expertiseTagId" INTEGER NOT NULL,

    PRIMARY KEY ("expertDataId","expertiseTagId")
);

-- CreateTable
CREATE TABLE "expertise_tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instructor_screening" (
    "id" SERIAL NOT NULL,
    "success" BOOLEAN NOT NULL,
    "comment" TEXT,
    "knowsCoronaSchoolFrom" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "screenerId" INTEGER,
    "studentId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jufo_verification_transmission" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uuid" TEXT NOT NULL,
    "studentId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecture" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "instructorId" INTEGER,
    "subcourseId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log" (
    "id" SERIAL NOT NULL,
    "logtype" "log_logtype_enum" NOT NULL DEFAULT E'misc',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "dissolved" BOOLEAN NOT NULL DEFAULT false,
    "dissolveReason" INTEGER,
    "proposedTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedbackToPupilMail" BOOLEAN NOT NULL DEFAULT false,
    "feedbackToStudentMail" BOOLEAN NOT NULL DEFAULT false,
    "followUpToPupilMail" BOOLEAN NOT NULL DEFAULT false,
    "followUpToStudentMail" BOOLEAN NOT NULL DEFAULT false,
    "source" "match_source_enum" NOT NULL DEFAULT E'matchedinternal',
    "studentId" INTEGER,
    "pupilId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentor" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstname" TEXT,
    "lastname" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT NOT NULL,
    "verification" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "authToken" TEXT,
    "authTokenUsed" BOOLEAN NOT NULL DEFAULT false,
    "authTokenSent" TIMESTAMP(3),
    "wix_id" TEXT NOT NULL,
    "wix_creation_date" TIMESTAMP(3) NOT NULL,
    "division" "mentor_division_enum"[],
    "expertise" "mentor_expertise_enum"[],
    "subjects" TEXT,
    "teachingExperience" BOOLEAN,
    "message" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participation_certificate" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "subjects" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    "certificateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hoursPerWeek" DECIMAL(65,30) NOT NULL,
    "hoursTotal" DECIMAL(65,30) NOT NULL,
    "medium" TEXT NOT NULL,
    "ongoingLessons" BOOLEAN NOT NULL DEFAULT false,
    "state" TEXT NOT NULL DEFAULT E'manual',
    "signatureLocation" TEXT,
    "signatureDate" TIMESTAMP(3),
    "studentId" INTEGER,
    "pupilId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_coaching_screening" (
    "id" SERIAL NOT NULL,
    "success" BOOLEAN NOT NULL,
    "comment" TEXT,
    "knowsCoronaSchoolFrom" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "screenerId" INTEGER,
    "studentId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_field_with_grade_restriction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectField" "project_field_with_grade_restriction_projectfield_enum" NOT NULL,
    "min" INTEGER,
    "max" INTEGER,
    "studentId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_match" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dissolved" BOOLEAN NOT NULL DEFAULT false,
    "dissolveReason" INTEGER,
    "studentId" INTEGER,
    "pupilId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pupil" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstname" TEXT,
    "lastname" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT NOT NULL,
    "verification" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "authToken" TEXT,
    "authTokenUsed" BOOLEAN NOT NULL DEFAULT false,
    "authTokenSent" TIMESTAMP(3),
    "wix_id" TEXT NOT NULL,
    "wix_creation_date" TIMESTAMP(3) NOT NULL,
    "state" "pupil_state_enum" NOT NULL DEFAULT E'other',
    "schooltype" "pupil_schooltype_enum" NOT NULL DEFAULT E'other',
    "msg" TEXT,
    "grade" TEXT,
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "isPupil" BOOLEAN NOT NULL DEFAULT false,
    "subjects" TEXT,
    "openMatchRequestCount" INTEGER NOT NULL DEFAULT 1,
    "isParticipant" BOOLEAN NOT NULL DEFAULT true,
    "isProjectCoachee" BOOLEAN NOT NULL DEFAULT false,
    "projectFields" "pupil_projectfields_enum"[],
    "isJufoParticipant" TEXT NOT NULL DEFAULT E'unsure',
    "openProjectMatchRequestCount" INTEGER NOT NULL DEFAULT 1,
    "projectMemberCount" INTEGER NOT NULL DEFAULT 1,
    "languages" "pupil_languages_enum"[],
    "learningGermanSince" "pupil_learninggermansince_enum",
    "matchingPriority" INTEGER NOT NULL DEFAULT 0,
    "lastUpdatedSettingsViaBlocker" TIMESTAMP(3),
    "teacherEmailAddress" TEXT,
    "registrationSource" "pupil_registrationsource_enum" NOT NULL,
    "schoolId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "emailDomain" TEXT NOT NULL,
    "state" "school_state_enum" DEFAULT E'other',
    "schooltype" "school_schooltype_enum" NOT NULL DEFAULT E'other',
    "activeCooperation" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screener" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstname" TEXT,
    "lastname" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT NOT NULL,
    "verification" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "authToken" TEXT,
    "authTokenUsed" BOOLEAN NOT NULL DEFAULT false,
    "authTokenSent" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "verified" BOOLEAN DEFAULT false,
    "oldNumberID" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screening" (
    "id" SERIAL NOT NULL,
    "success" BOOLEAN NOT NULL,
    "comment" TEXT,
    "knowsCoronaSchoolFrom" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "screenerId" INTEGER,
    "studentId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstname" TEXT,
    "lastname" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT NOT NULL,
    "verification" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "authToken" TEXT,
    "authTokenUsed" BOOLEAN NOT NULL DEFAULT false,
    "authTokenSent" TIMESTAMP(3),
    "wix_id" TEXT NOT NULL,
    "wix_creation_date" TIMESTAMP(3) NOT NULL,
    "phone" TEXT,
    "feedback" TEXT,
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "isStudent" BOOLEAN NOT NULL DEFAULT false,
    "subjects" TEXT,
    "openMatchRequestCount" INTEGER NOT NULL DEFAULT 1,
    "isInstructor" BOOLEAN NOT NULL DEFAULT false,
    "msg" TEXT,
    "state" "student_state_enum" DEFAULT E'other',
    "university" TEXT,
    "module" "student_module_enum",
    "moduleHours" INTEGER,
    "isProjectCoach" BOOLEAN NOT NULL DEFAULT false,
    "wasJufoParticipant" TEXT,
    "hasJufoCertificate" BOOLEAN,
    "jufoPastParticipationInfo" TEXT,
    "jufoPastParticipationConfirmed" BOOLEAN,
    "isUniversityStudent" BOOLEAN,
    "openProjectMatchRequestCount" INTEGER NOT NULL DEFAULT 1,
    "sentJufoAlumniScreeningReminderCount" INTEGER NOT NULL DEFAULT 0,
    "lastSentJufoAlumniScreeningInvitationDate" TIMESTAMP(3),
    "supportsInDaZ" BOOLEAN,
    "languages" "student_languages_enum"[],
    "sentScreeningReminderCount" INTEGER NOT NULL DEFAULT 0,
    "lastSentScreeningInvitationDate" TIMESTAMP(3),
    "sentInstructorScreeningReminderCount" INTEGER NOT NULL DEFAULT 0,
    "lastSentInstructorScreeningInvitationDate" TIMESTAMP(3),
    "lastUpdatedSettingsViaBlocker" TIMESTAMP(3),
    "registrationSource" "student_registrationsource_enum" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcourse" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "minGrade" INTEGER NOT NULL,
    "maxGrade" INTEGER NOT NULL,
    "maxParticipants" INTEGER NOT NULL,
    "joinAfterStart" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL,
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "courseId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcourse_instructors_student" (
    "subcourseId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    PRIMARY KEY ("subcourseId","studentId")
);

-- CreateTable
CREATE TABLE "subcourse_participants_pupil" (
    "subcourseId" INTEGER NOT NULL,
    "pupilId" INTEGER NOT NULL,

    PRIMARY KEY ("subcourseId","pupilId")
);

-- CreateTable
CREATE TABLE "subcourse_waiting_list_pupil" (
    "subcourseId" INTEGER NOT NULL,
    "pupilId" INTEGER NOT NULL,

    PRIMARY KEY ("subcourseId","pupilId")
);

-- CreateTable
CREATE TABLE "course_guest" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "courseId" INTEGER,
    "inviterId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_participation_certificate" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuerId" INTEGER,
    "pupilId" INTEGER,
    "subcourseId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pupil_tutoring_interest_confirmation_request" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT E'pending',
    "token" TEXT NOT NULL,
    "reminderSentDate" TIMESTAMP(3),
    "pupilId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IDX_54bce9a9a93ae130beaa70bb2f" ON "course_instructors_student"("courseId");

-- CreateIndex
CREATE INDEX "IDX_66b47860afa3098729925338c1" ON "course_instructors_student"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "course_tag.identifier_unique" ON "course_tag"("identifier");

-- CreateIndex
CREATE INDEX "IDX_af4499c3ae1153ac06782b2e5b" ON "course_tags_course_tag"("courseTagId");

-- CreateIndex
CREATE INDEX "IDX_d6261ad9de1fc5f06946095bf8" ON "course_tags_course_tag"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "expert_data.studentId_unique" ON "expert_data"("studentId");

-- CreateIndex
CREATE INDEX "IDX_73044a211048e72c2026425c81" ON "expert_data_expertise_tags_expertise_tag"("expertDataId");

-- CreateIndex
CREATE INDEX "IDX_8a81e80d1d580b868ed36ca123" ON "expert_data_expertise_tags_expertise_tag"("expertiseTagId");

-- CreateIndex
CREATE UNIQUE INDEX "expertise_tag.name_unique" ON "expertise_tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_screening.studentId_unique" ON "instructor_screening"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "jufo_verification_transmission.studentId_unique" ON "jufo_verification_transmission"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "match.uuid_unique" ON "match"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_MATCH" ON "match"("studentId", "pupilId");

-- CreateIndex
CREATE UNIQUE INDEX "mentor.email_unique" ON "mentor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mentor.verification_unique" ON "mentor"("verification");

-- CreateIndex
CREATE UNIQUE INDEX "mentor.authToken_unique" ON "mentor"("authToken");

-- CreateIndex
CREATE UNIQUE INDEX "mentor.wix_id_unique" ON "mentor"("wix_id");

-- CreateIndex
CREATE UNIQUE INDEX "participation_certificate.uuid_unique" ON "participation_certificate"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "project_coaching_screening.studentId_unique" ON "project_coaching_screening"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_PROJECT_FIELDS" ON "project_field_with_grade_restriction"("projectField", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "project_match.uuid_unique" ON "project_match"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_PJ_MATCH" ON "project_match"("studentId", "pupilId");

-- CreateIndex
CREATE UNIQUE INDEX "pupil.email_unique" ON "pupil"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pupil.verification_unique" ON "pupil"("verification");

-- CreateIndex
CREATE UNIQUE INDEX "pupil.authToken_unique" ON "pupil"("authToken");

-- CreateIndex
CREATE UNIQUE INDEX "pupil.wix_id_unique" ON "pupil"("wix_id");

-- CreateIndex
CREATE UNIQUE INDEX "school.website_unique" ON "school"("website");

-- CreateIndex
CREATE UNIQUE INDEX "school.emailDomain_unique" ON "school"("emailDomain");

-- CreateIndex
CREATE UNIQUE INDEX "screener.email_unique" ON "screener"("email");

-- CreateIndex
CREATE UNIQUE INDEX "screener.verification_unique" ON "screener"("verification");

-- CreateIndex
CREATE UNIQUE INDEX "screener.authToken_unique" ON "screener"("authToken");

-- CreateIndex
CREATE UNIQUE INDEX "screener.oldNumberID_unique" ON "screener"("oldNumberID");

-- CreateIndex
CREATE UNIQUE INDEX "screening.studentId_unique" ON "screening"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "student.email_unique" ON "student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student.verification_unique" ON "student"("verification");

-- CreateIndex
CREATE UNIQUE INDEX "student.authToken_unique" ON "student"("authToken");

-- CreateIndex
CREATE UNIQUE INDEX "student.wix_id_unique" ON "student"("wix_id");

-- CreateIndex
CREATE INDEX "IDX_3f0c594b9393bf4ca9ed368196" ON "subcourse_instructors_student"("subcourseId");

-- CreateIndex
CREATE INDEX "IDX_b36e4eeff8040a09cc811dbb26" ON "subcourse_instructors_student"("studentId");

-- CreateIndex
CREATE INDEX "IDX_47d9d98b6496554165e08ff61d" ON "subcourse_participants_pupil"("pupilId");

-- CreateIndex
CREATE INDEX "IDX_cde91c063947d1302d50c906dc" ON "subcourse_participants_pupil"("subcourseId");

-- CreateIndex
CREATE INDEX "IDX_3bd25f377afc44f574f7ac3d09" ON "subcourse_waiting_list_pupil"("pupilId");

-- CreateIndex
CREATE INDEX "IDX_df9eb9663f8085da35f7ca5547" ON "subcourse_waiting_list_pupil"("subcourseId");

-- CreateIndex
CREATE UNIQUE INDEX "course_guest.token_unique" ON "course_guest"("token");

-- CreateIndex
CREATE UNIQUE INDEX "pupil_tutoring_interest_confirmation_request.token_unique" ON "pupil_tutoring_interest_confirmation_request"("token");

-- CreateIndex
CREATE UNIQUE INDEX "pupil_tutoring_interest_confirmation_request.pupilId_unique" ON "pupil_tutoring_interest_confirmation_request"("pupilId");

-- AddForeignKey
ALTER TABLE "course" ADD FOREIGN KEY ("correspondentId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_attendance_log" ADD FOREIGN KEY ("lectureId") REFERENCES "lecture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_attendance_log" ADD FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_instructors_student" ADD FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_instructors_student" ADD FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_tags_course_tag" ADD FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_tags_course_tag" ADD FOREIGN KEY ("courseTagId") REFERENCES "course_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_data" ADD FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_data_expertise_tags_expertise_tag" ADD FOREIGN KEY ("expertDataId") REFERENCES "expert_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_data_expertise_tags_expertise_tag" ADD FOREIGN KEY ("expertiseTagId") REFERENCES "expertise_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_screening" ADD FOREIGN KEY ("screenerId") REFERENCES "screener"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_screening" ADD FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jufo_verification_transmission" ADD FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture" ADD FOREIGN KEY ("instructorId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture" ADD FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation_certificate" ADD FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation_certificate" ADD FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_coaching_screening" ADD FOREIGN KEY ("screenerId") REFERENCES "screener"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_coaching_screening" ADD FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_field_with_grade_restriction" ADD FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_match" ADD FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_match" ADD FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pupil" ADD FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screening" ADD FOREIGN KEY ("screenerId") REFERENCES "screener"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screening" ADD FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcourse" ADD FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcourse_instructors_student" ADD FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcourse_instructors_student" ADD FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcourse_participants_pupil" ADD FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcourse_participants_pupil" ADD FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcourse_waiting_list_pupil" ADD FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcourse_waiting_list_pupil" ADD FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_guest" ADD FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_guest" ADD FOREIGN KEY ("inviterId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_participation_certificate" ADD FOREIGN KEY ("issuerId") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_participation_certificate" ADD FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_participation_certificate" ADD FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pupil_tutoring_interest_confirmation_request" ADD FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE SET NULL ON UPDATE CASCADE;
