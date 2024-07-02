-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "course_category_enum" AS ENUM ('language', 'focus', 'revision', 'club', 'coaching');

-- CreateEnum
CREATE TYPE "course_coursestate_enum" AS ENUM ('created', 'submitted', 'allowed', 'denied', 'cancelled');

-- CreateEnum
CREATE TYPE "expert_data_allowed_enum" AS ENUM ('pending', 'yes', 'no');

-- CreateEnum
CREATE TYPE "log_logtype_enum" AS ENUM ('misc', 'verificationRequets', 'verified', 'matchDissolve', 'projectMatchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'updateProjectFields', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest', 'cocCancel', 'cancelledCourse', 'cancelledSubcourse', 'createdCourseAttendanceLog', 'contactMentor', 'bbbMeeting', 'contactExpert', 'participantJoinedCourse', 'participantLeftCourse', 'participantJoinedWaitingList', 'participantLeftWaitingList', 'userAccessedCourseWhileAuthenticated', 'instructorIssuedCertificate', 'pupilInterestConfirmationRequestSent', 'pupilInterestConfirmationRequestReminderSent', 'pupilInterestConfirmationRequestStatusChange');

-- CreateEnum
CREATE TYPE "match_source_enum" AS ENUM ('imported', 'matchedexternal', 'matchedinternal');

-- CreateEnum
CREATE TYPE "mentor_division_enum" AS ENUM ('facebook', 'email', 'events', 'video', 'supervision');

-- CreateEnum
CREATE TYPE "mentor_expertise_enum" AS ENUM ('language difficulties and communication', 'specialized expertise in subjects', 'educational and didactic expertise', 'technical support', 'self-organization');

-- CreateEnum
CREATE TYPE "project_field_with_grade_restriction_projectfield_enum" AS ENUM ('Arbeitswelt', 'Biologie', 'Chemie', 'Geo-und-Raumwissenschaften', 'Mathematik/Informatik', 'Physik', 'Technik');

-- CreateEnum
CREATE TYPE "pupil_languages_enum" AS ENUM ('Albanisch', 'Arabisch', 'Armenisch', 'Aserbaidschanisch', 'Bosnisch', 'Bulgarisch', 'Chinesisch', 'Deutsch', 'Englisch', 'Französisch', 'Italienisch', 'Kasachisch', 'Kurdisch', 'Polnisch', 'Portugiesisch', 'Russisch', 'Türkisch', 'Spanisch', 'Ukrainisch', 'Vietnamesisch', 'Andere');

-- CreateEnum
CREATE TYPE "pupil_learninggermansince_enum" AS ENUM ('>4', '2-4', '1-2', '<1');

-- CreateEnum
CREATE TYPE "pupil_projectfields_enum" AS ENUM ('Arbeitswelt', 'Biologie', 'Chemie', 'Geo-und-Raumwissenschaften', 'Mathematik/Informatik', 'Physik', 'Technik');

-- CreateEnum
CREATE TYPE "pupil_registrationsource_enum" AS ENUM ('0', '1', '2', '3', '4', '5');

-- CreateEnum
CREATE TYPE "pupil_schooltype_enum" AS ENUM ('grundschule', 'gesamtschule', 'hauptschule', 'realschule', 'gymnasium', 'förderschule', 'berufsschule', 'other');

-- CreateEnum
CREATE TYPE "pupil_state_enum" AS ENUM ('bw', 'by', 'be', 'bb', 'hb', 'hh', 'he', 'mv', 'ni', 'nw', 'rp', 'sl', 'sn', 'st', 'sh', 'th', 'other');

-- CreateEnum
CREATE TYPE "school_schooltype_enum" AS ENUM ('grundschule', 'gesamtschule', 'hauptschule', 'realschule', 'gymnasium', 'förderschule', 'berufsschule', 'other');

-- CreateEnum
CREATE TYPE "school_state_enum" AS ENUM ('bw', 'by', 'be', 'bb', 'hb', 'hh', 'he', 'mv', 'ni', 'nw', 'rp', 'sl', 'sn', 'st', 'sh', 'th', 'other');

-- CreateEnum
CREATE TYPE "student_languages_enum" AS ENUM ('Albanisch', 'Arabisch', 'Armenisch', 'Aserbaidschanisch', 'Bosnisch', 'Bulgarisch', 'Chinesisch', 'Deutsch', 'Englisch', 'Französisch', 'Italienisch', 'Kasachisch', 'Kurdisch', 'Polnisch', 'Portugiesisch', 'Russisch', 'Türkisch', 'Spanisch', 'Ukrainisch', 'Vietnamesisch', 'Andere');

-- CreateEnum
CREATE TYPE "student_module_enum" AS ENUM ('internship', 'seminar', 'other');

-- CreateEnum
CREATE TYPE "student_registrationsource_enum" AS ENUM ('0', '1', '2', '3', '4', '5');

-- CreateEnum
CREATE TYPE "student_state_enum" AS ENUM ('bw', 'by', 'be', 'bb', 'hb', 'hh', 'he', 'mv', 'ni', 'nw', 'rp', 'sl', 'sn', 'st', 'sh', 'th', 'other');

-- CreateEnum
CREATE TYPE "notification_sender_enum" AS ENUM ('SUPPORT', 'CERTIFICATE_OF_CONDUCT');

-- CreateEnum
CREATE TYPE "secret_type_enum" AS ENUM ('PASSWORD', 'TOKEN', 'EMAIL_TOKEN');

-- CreateEnum
CREATE TYPE "course_schooltype_enum" AS ENUM ('grundschule', 'gesamtschule', 'hauptschule', 'realschule', 'gymnasium', 'förderschule', 'berufsschule', 'other');

-- CreateEnum
CREATE TYPE "course_subject_enum" AS ENUM ('Mathematik', 'Deutsch', 'Englisch', 'Biologie', 'Chemie', 'Physik', 'Informatik', 'Sachkunde', 'Geschichte', 'Erdkunde', 'Wirtschaft', 'Politik', 'Philosophie', 'Kunst', 'Musik', 'Pädagogik', 'Französisch', 'Latein', 'Altgriechisch', 'Spanisch', 'Italienisch', 'Russisch', 'Niederländisch', 'Deutsch als Zweitsprache', 'Religion');

-- CreateEnum
CREATE TYPE "message_translation_language_enum" AS ENUM ('en', 'de');

-- CreateEnum
CREATE TYPE "notification_type_enum" AS ENUM ('chat', 'survey', 'appointment', 'advice', 'suggestion', 'announcement', 'call', 'news', 'event', 'request', 'alternative', 'account', 'onboarding', 'match', 'course', 'certificate', 'legacy');

-- CreateEnum
CREATE TYPE "important_information_language_enum" AS ENUM ('en', 'de');

-- CreateEnum
CREATE TYPE "important_information_recipients_enum" AS ENUM ('students', 'pupils');

-- CreateEnum
CREATE TYPE "pupil_screening_status_enum" AS ENUM ('0', '1', '2', '3');

-- CreateEnum
CREATE TYPE "lecture_appointmenttype_enum" AS ENUM ('group', 'match', 'internal', 'legacy');

-- CreateEnum
CREATE TYPE "chat_type" AS ENUM ('NORMAL', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "screening_jobstatus_enum" AS ENUM ('Student', 'Pupil', 'Employee', 'Retiree', 'Misc');

-- CreateTable
CREATE TABLE "attachment" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "uploaderID" VARCHAR NOT NULL,
    "filename" VARCHAR NOT NULL,
    "size" INTEGER NOT NULL,
    "attachmentGroupId" VARCHAR NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bbb_meeting" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meetingID" VARCHAR NOT NULL,
    "meetingName" VARCHAR,
    "attendeePW" VARCHAR,
    "moderatorPW" VARCHAR,
    "alternativeUrl" VARCHAR,

    CONSTRAINT "PK_33f2c503196edee1b2e5899083f" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concrete_notification" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR NOT NULL,
    "notificationID" INTEGER NOT NULL,
    "contextID" VARCHAR,
    "context" JSON NOT NULL,
    "attachmentGroupId" VARCHAR,
    "sentAt" TIMESTAMP(6) NOT NULL,
    "state" INTEGER NOT NULL,
    "error" VARCHAR,

    CONSTRAINT "PK_830b05c48e7ba274a9e4bceced3" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR NOT NULL,
    "outline" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "imageKey" VARCHAR,
    "category" "course_category_enum" NOT NULL,
    "subject" "course_subject_enum",
    "schooltype" "course_schooltype_enum"[] DEFAULT ARRAY['other']::"course_schooltype_enum"[],
    "courseState" "course_coursestate_enum" NOT NULL DEFAULT 'created',
    "screeningComment" VARCHAR,
    "publicRanking" INTEGER NOT NULL DEFAULT 0,
    "allowContact" BOOLEAN NOT NULL DEFAULT false,
    "correspondentId" INTEGER,

    CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_attendance_log" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendedTime" INTEGER,
    "ip" VARCHAR,
    "pupilId" INTEGER,
    "lectureId" INTEGER,

    CONSTRAINT "PK_c3906899bb64b97b840ea1f2656" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_guest" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" VARCHAR NOT NULL,
    "firstname" VARCHAR NOT NULL,
    "lastname" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "courseId" INTEGER,
    "inviterId" INTEGER,

    CONSTRAINT "PK_f12462c16c543cf76ed1fa49289" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_instructors_student" (
    "courseId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "PK_aa54b28c5de0010f486dd0d72df" PRIMARY KEY ("courseId","studentId")
);

-- CreateTable
CREATE TABLE "course_participation_certificate" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuerId" INTEGER,
    "pupilId" INTEGER,
    "subcourseId" INTEGER,

    CONSTRAINT "PK_ee8536af11485574445cf6c0b0e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_tag" (
    "id" SERIAL NOT NULL,
    "identifier" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "category" VARCHAR NOT NULL,

    CONSTRAINT "PK_6c6a0ad4b5f67db91353e5b2ae1" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_tags_course_tag" (
    "courseId" INTEGER NOT NULL,
    "courseTagId" INTEGER NOT NULL,

    CONSTRAINT "PK_3996cf424477234b88a0980fd39" PRIMARY KEY ("courseId","courseTagId")
);

-- CreateTable
CREATE TABLE "expert_data" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contactEmail" VARCHAR NOT NULL,
    "description" VARCHAR,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "allowed" "expert_data_allowed_enum" NOT NULL DEFAULT 'pending',
    "studentId" INTEGER,

    CONSTRAINT "PK_096e6e0f8fcc7e142b555fde91e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_data_expertise_tags_expertise_tag" (
    "expertDataId" INTEGER NOT NULL,
    "expertiseTagId" INTEGER NOT NULL,

    CONSTRAINT "PK_bc62a3cbf8ed9f07fc7e43163d4" PRIMARY KEY ("expertDataId","expertiseTagId")
);

-- CreateTable
CREATE TABLE "expertise_tag" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_4251b103cf2216af06b5c8625f8" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instructor_screening" (
    "id" SERIAL NOT NULL,
    "success" BOOLEAN NOT NULL,
    "comment" VARCHAR,
    "jobStatus" "screening_jobstatus_enum",
    "knowsCoronaSchoolFrom" VARCHAR,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "screenerId" INTEGER,
    "studentId" INTEGER,

    CONSTRAINT "PK_e29a51f8dce0a07d2e1dba73636" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jufo_verification_transmission" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uuid" VARCHAR NOT NULL,
    "studentId" INTEGER,

    CONSTRAINT "PK_3e81acd237ad0b7e97003c835d8" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecture" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start" TIMESTAMP(6) NOT NULL,
    "duration" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "appointmentType" "lecture_appointmenttype_enum" NOT NULL DEFAULT 'legacy',
    "isCanceled" BOOLEAN DEFAULT false,
    "organizerIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "participantIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "declinedBy" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "zoomMeetingId" VARCHAR,
    "zoomMeetingReport" JSON[] DEFAULT ARRAY[]::JSON[],
    "instructorId" INTEGER,
    "subcourseId" INTEGER,
    "matchId" INTEGER,

    CONSTRAINT "PK_2abef7c1e52b7b58a9f905c9643" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log" (
    "id" SERIAL NOT NULL,
    "logtype" "log_logtype_enum" NOT NULL DEFAULT 'misc',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user" VARCHAR NOT NULL,
    "data" VARCHAR NOT NULL,

    CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR NOT NULL,
    "dissolved" BOOLEAN NOT NULL DEFAULT false,
    "dissolvedAt" TIMESTAMP(6),
    "dissolveReason" INTEGER,
    "proposedTime" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedbackToPupilMail" BOOLEAN NOT NULL DEFAULT false,
    "feedbackToStudentMail" BOOLEAN NOT NULL DEFAULT false,
    "followUpToPupilMail" BOOLEAN NOT NULL DEFAULT false,
    "followUpToStudentMail" BOOLEAN NOT NULL DEFAULT false,
    "source" "match_source_enum" NOT NULL DEFAULT 'matchedinternal',
    "studentFirstMatchRequest" TIMESTAMP(6),
    "pupilFirstMatchRequest" TIMESTAMP(6),
    "matchPool" VARCHAR,
    "studentId" INTEGER,
    "pupilId" INTEGER,

    CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentor" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstname" VARCHAR,
    "lastname" VARCHAR,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "email" VARCHAR NOT NULL,
    "verifiedAt" TIMESTAMP(6),
    "verification" VARCHAR,

    "isRedacted" BOOLEAN NOT NULL DEFAULT false,
    "lastTimeCheckedNotifications" TIMESTAMP(6) DEFAULT '1970-01-01 00:00:00'::timestamp without time zone,
    "notificationPreferences" JSON,
    "lastLogin" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "wix_id" VARCHAR NOT NULL,
    "wix_creation_date" TIMESTAMP(6) NOT NULL,
    "division" "mentor_division_enum"[],
    "expertise" "mentor_expertise_enum"[],
    "subjects" VARCHAR,
    "teachingExperience" BOOLEAN,
    "message" VARCHAR,
    "description" VARCHAR,
    "imageUrl" VARCHAR,

    CONSTRAINT "PK_9fcebd0a40237e9b6defcbd9d74" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "mailjetTemplateId" INTEGER,
    "description" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL,
    "recipient" INTEGER NOT NULL,
    "onActions" TEXT[],
    "type" "notification_type_enum" NOT NULL DEFAULT 'legacy',
    "cancelledOnAction" TEXT[],
    "delay" INTEGER,
    "interval" INTEGER,
    "sender" "notification_sender_enum",
    "hookID" VARCHAR,
    "sample_context" JSON,

    CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participation_certificate" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR NOT NULL,
    "subjects" VARCHAR NOT NULL,
    "categories" VARCHAR NOT NULL,
    "certificateDate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hoursPerWeek" DECIMAL NOT NULL,
    "hoursTotal" DECIMAL NOT NULL,
    "medium" VARCHAR NOT NULL,
    "ongoingLessons" BOOLEAN NOT NULL DEFAULT false,
    "state" VARCHAR NOT NULL DEFAULT 'manual',
    "signaturePupil" BYTEA,
    "signatureParent" BYTEA,
    "signatureLocation" VARCHAR,
    "signatureDate" TIMESTAMP(6),
    "studentId" INTEGER,
    "pupilId" INTEGER,

    CONSTRAINT "PK_431b3e203adb26c29ecef120034" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_coaching_screening" (
    "id" SERIAL NOT NULL,
    "success" BOOLEAN NOT NULL,
    "comment" VARCHAR,
    "knowsCoronaSchoolFrom" VARCHAR,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "screenerId" INTEGER,
    "studentId" INTEGER,

    CONSTRAINT "PK_4a1d3d3d6f0fa2b36c8347e357c" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_field_with_grade_restriction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectField" "project_field_with_grade_restriction_projectfield_enum" NOT NULL,
    "min" INTEGER,
    "max" INTEGER,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "PK_9f450f4d0e5e20c5a0a6fee6dea" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_match" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dissolved" BOOLEAN NOT NULL DEFAULT false,
    "dissolveReason" INTEGER,
    "studentId" INTEGER,
    "pupilId" INTEGER,

    CONSTRAINT "PK_14902d121cc871092943b3857e5" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pupil" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstname" VARCHAR,
    "lastname" VARCHAR,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "email" VARCHAR NOT NULL,
    "verifiedAt" TIMESTAMP(6),
    "verification" VARCHAR,
    "isRedacted" BOOLEAN NOT NULL DEFAULT false,
    "lastTimeCheckedNotifications" TIMESTAMP(6) DEFAULT '1970-01-01 00:00:00'::timestamp without time zone,
    "notificationPreferences" JSON,
    "lastLogin" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "wix_id" VARCHAR NOT NULL,
    "wix_creation_date" TIMESTAMP(6) NOT NULL,
    "state" "pupil_state_enum" NOT NULL DEFAULT 'other',
    "schooltype" "pupil_schooltype_enum" NOT NULL DEFAULT 'other',
    "msg" VARCHAR,
    "grade" VARCHAR,
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "isPupil" BOOLEAN NOT NULL DEFAULT false,
    "subjects" VARCHAR,
    "openMatchRequestCount" INTEGER NOT NULL DEFAULT 1,
    "firstMatchRequest" TIMESTAMP(6),
    "isParticipant" BOOLEAN NOT NULL DEFAULT true,
    "isProjectCoachee" BOOLEAN NOT NULL DEFAULT false,
    "projectFields" "pupil_projectfields_enum"[] DEFAULT ARRAY[]::"pupil_projectfields_enum"[],
    "isJufoParticipant" VARCHAR NOT NULL DEFAULT 'unsure',
    "openProjectMatchRequestCount" INTEGER NOT NULL DEFAULT 1,
    "projectMemberCount" INTEGER NOT NULL DEFAULT 1,
    "languages" "pupil_languages_enum"[] DEFAULT ARRAY[]::"pupil_languages_enum"[],
    "learningGermanSince" "pupil_learninggermansince_enum",
    "matchingPriority" INTEGER NOT NULL DEFAULT 0,
    "lastUpdatedSettingsViaBlocker" TIMESTAMP(6),
    "teacherEmailAddress" VARCHAR,
    "registrationSource" "pupil_registrationsource_enum" NOT NULL DEFAULT '0',
    "coduToken" VARCHAR,
    "aboutMe" VARCHAR NOT NULL DEFAULT '',
    "matchReason" VARCHAR NOT NULL DEFAULT '',
    "schoolId" INTEGER,

    CONSTRAINT "PK_34f2dbae733affb8884c2255c21" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pupil_tutoring_interest_confirmation_request" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR NOT NULL DEFAULT 'pending',
    "invalidated" BOOLEAN NOT NULL DEFAULT false,
    "token" VARCHAR NOT NULL,
    "reminderSentDate" TIMESTAMP(6),
    "pupilId" INTEGER,

    CONSTRAINT "PK_5f3515ba0bd182b1cc34f06ef11" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remission_request" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uuid" VARCHAR NOT NULL,
    "studentId" INTEGER,

    CONSTRAINT "PK_4ea2cbe40d9d5cfe1d39a44558f" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR NOT NULL,
    "website" VARCHAR,
    "emailDomain" VARCHAR NOT NULL,
    "state" "school_state_enum" DEFAULT 'other',
    "schooltype" "school_schooltype_enum" NOT NULL DEFAULT 'other',
    "activeCooperation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_57836c3fe2f2c7734b20911755e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screener" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstname" VARCHAR,
    "lastname" VARCHAR,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "email" VARCHAR NOT NULL,
    "verifiedAt" TIMESTAMP(6),
    "verification" VARCHAR,
    "isRedacted" BOOLEAN NOT NULL DEFAULT false,
    "lastTimeCheckedNotifications" TIMESTAMP(6) DEFAULT '1970-01-01 00:00:00'::timestamp without time zone,
    "notificationPreferences" JSON,
    "lastLogin" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "password" VARCHAR NOT NULL,
    "verified" BOOLEAN DEFAULT false,
    "oldNumberID" INTEGER,

    CONSTRAINT "PK_3a023b02ed01df4a6956af1ea94" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screening" (
    "id" SERIAL NOT NULL,
    "success" BOOLEAN NOT NULL,
    "comment" VARCHAR,
    "jobStatus" "screening_jobstatus_enum",
    "knowsCoronaSchoolFrom" VARCHAR,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "screenerId" INTEGER,
    "studentId" INTEGER,

    CONSTRAINT "PK_5111bc526c9133721aeffb9a578" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstname" VARCHAR,
    "lastname" VARCHAR,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "email" VARCHAR NOT NULL,
    "verifiedAt" TIMESTAMP(6),
    "verification" VARCHAR,
    "isRedacted" BOOLEAN NOT NULL DEFAULT false,
    "lastTimeCheckedNotifications" TIMESTAMP(6) DEFAULT '1970-01-01 00:00:00'::timestamp without time zone,
    "notificationPreferences" JSON,
    "lastLogin" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "wix_id" VARCHAR NOT NULL,
    "wix_creation_date" TIMESTAMP(6) NOT NULL,
    "phone" VARCHAR,
    "feedback" VARCHAR,
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "isStudent" BOOLEAN NOT NULL DEFAULT false,
    "subjects" VARCHAR,
    "openMatchRequestCount" INTEGER NOT NULL DEFAULT 1,
    "firstMatchRequest" TIMESTAMP(6),
    "isCodu" BOOLEAN NOT NULL DEFAULT false,
    "isInstructor" BOOLEAN NOT NULL DEFAULT false,
    "msg" VARCHAR,
    "state" "student_state_enum" DEFAULT 'other',
    "university" VARCHAR,
    "module" "student_module_enum",
    "moduleHours" INTEGER,
    "isProjectCoach" BOOLEAN NOT NULL DEFAULT false,
    "wasJufoParticipant" VARCHAR,
    "hasJufoCertificate" BOOLEAN,
    "jufoPastParticipationInfo" VARCHAR,
    "jufoPastParticipationConfirmed" BOOLEAN,
    "isUniversityStudent" BOOLEAN,
    "openProjectMatchRequestCount" INTEGER NOT NULL DEFAULT 1,
    "sentJufoAlumniScreeningReminderCount" INTEGER NOT NULL DEFAULT 0,
    "lastSentJufoAlumniScreeningInvitationDate" TIMESTAMP(6),
    "supportsInDaZ" BOOLEAN,
    "languages" "student_languages_enum"[] DEFAULT ARRAY[]::"student_languages_enum"[],
    "sentScreeningReminderCount" INTEGER NOT NULL DEFAULT 0,
    "lastSentScreeningInvitationDate" TIMESTAMP(6),
    "sentInstructorScreeningReminderCount" INTEGER NOT NULL DEFAULT 0,
    "lastSentInstructorScreeningInvitationDate" TIMESTAMP(6),
    "lastUpdatedSettingsViaBlocker" TIMESTAMP(6),
    "registrationSource" "student_registrationsource_enum" NOT NULL DEFAULT '0',
    "aboutMe" VARCHAR NOT NULL DEFAULT '',
    "zoomUserId" VARCHAR,

    CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcourse" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "minGrade" INTEGER NOT NULL,
    "maxGrade" INTEGER NOT NULL,
    "maxParticipants" INTEGER NOT NULL,
    "joinAfterStart" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL,
    "publishedAt" TIMESTAMP(6),
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "alreadyPromoted" BOOLEAN NOT NULL DEFAULT false,
    "conversationId" VARCHAR,
    "allowChatContactProspects" BOOLEAN NOT NULL DEFAULT true,
    "allowChatContactParticipants" BOOLEAN NOT NULL DEFAULT true,
    "groupChatType" "chat_type" NOT NULL DEFAULT 'NORMAL',
    "courseId" INTEGER,

    CONSTRAINT "PK_304edeed9f68de88999028fe80e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcourse_instructors_student" (
    "subcourseId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "PK_e41756ec54d1828c27b0a5dc055" PRIMARY KEY ("subcourseId","studentId")
);

-- CreateTable
CREATE TABLE "subcourse_participants_pupil" (
    "subcourseId" INTEGER NOT NULL,
    "pupilId" INTEGER NOT NULL,

    CONSTRAINT "PK_7b8738e08eab7b5bf796f0eaf1b" PRIMARY KEY ("subcourseId","pupilId")
);

-- CreateTable
CREATE TABLE "subcourse_waiting_list_pupil" (
    "subcourseId" INTEGER NOT NULL,
    "pupilId" INTEGER NOT NULL,

    CONSTRAINT "PK_b35d059abbd7f4c4a1147f72ec9" PRIMARY KEY ("subcourseId","pupilId")
);

-- CreateTable
CREATE TABLE "certificate_of_conduct" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOfInspection" TIMESTAMP(6) NOT NULL,
    "dateOfIssue" TIMESTAMP(6) NOT NULL,
    "criminalRecords" BOOLEAN NOT NULL,
    "studentId" INTEGER,

    CONSTRAINT "PK_95058dd1916a7fb5ff77170c374" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_pool_run" (
    "id" SERIAL NOT NULL,
    "runAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matchingPool" VARCHAR NOT NULL,
    "matchesCreated" INTEGER NOT NULL,
    "stats" JSON NOT NULL,

    CONSTRAINT "PK_94a8e7729d108dfa44fb65c1a10" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secret" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" VARCHAR NOT NULL,
    "type" "secret_type_enum" NOT NULL,
    "secret" VARCHAR NOT NULL,
    "expiresAt" TIMESTAMP(6),
    "lastUsed" TIMESTAMP(6),
    "description" VARCHAR,

    CONSTRAINT "PK_6afa4961954e17ec2d6401afc3d" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typeorm_metadata" (
    "type" VARCHAR NOT NULL,
    "database" VARCHAR,
    "schema" VARCHAR,
    "table" VARCHAR,
    "name" VARCHAR,
    "value" TEXT
);

-- CreateTable
CREATE TABLE "message_translation" (
    "id" SERIAL NOT NULL,
    "template" JSON,
    "navigateTo" TEXT,
    "language" "message_translation_language_enum" NOT NULL DEFAULT 'de',
    "notificationId" INTEGER,

    CONSTRAINT "PK_159f92cfb8a0b269fbc863c74ee" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "important_information" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "recipients" "important_information_recipients_enum" NOT NULL,
    "navigateTo" TEXT,
    "language" "important_information_language_enum" NOT NULL DEFAULT 'de',

    CONSTRAINT "PK_bcd2068ca02cc6f323bf01754a5" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pupil_screening" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "pupil_screening_status_enum" NOT NULL DEFAULT '0',
    "invalidated" BOOLEAN NOT NULL DEFAULT false,
    "comment" VARCHAR,
    "pupilId" INTEGER,

    CONSTRAINT "PK_3b4bba5fc1846edc712915c9dfa" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waiting_list_enrollment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pupilId" INTEGER,
    "subcourseId" INTEGER,

    CONSTRAINT "PK_7c3bb40b03f8c4e1325ed4df416" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IDX_8fb7b15823c3ed0fea3c508ac4" ON "course_guest"("token");

-- CreateIndex
CREATE INDEX "IDX_54bce9a9a93ae130beaa70bb2f" ON "course_instructors_student"("courseId");

-- CreateIndex
CREATE INDEX "IDX_66b47860afa3098729925338c1" ON "course_instructors_student"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_275561ded9309f727f8e795bf1" ON "course_tag"("identifier");

-- CreateIndex
CREATE INDEX "IDX_af4499c3ae1153ac06782b2e5b" ON "course_tags_course_tag"("courseTagId");

-- CreateIndex
CREATE INDEX "IDX_d6261ad9de1fc5f06946095bf8" ON "course_tags_course_tag"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "REL_0bf0d1a1e138fd47f60e263524" ON "expert_data"("studentId");

-- CreateIndex
CREATE INDEX "IDX_73044a211048e72c2026425c81" ON "expert_data_expertise_tags_expertise_tag"("expertDataId");

-- CreateIndex
CREATE INDEX "IDX_8a81e80d1d580b868ed36ca123" ON "expert_data_expertise_tags_expertise_tag"("expertiseTagId");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_29beceeebc3a1eae3d78939713" ON "expertise_tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "REL_e176665fa769d2e603d825f6fa" ON "instructor_screening"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "REL_1ceddec34e7b90cdbb85ff9738" ON "jufo_verification_transmission"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_65a3ec8c0aa6c3c9c04f5b53e3" ON "match"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_MATCH" ON "match"("studentId", "pupilId");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_e03cfa18e81812d44f5cdf9479" ON "mentor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_704a7bf0ca9889bd5c4ea1a15b" ON "mentor"("verification"); 

-- CreateIndex
CREATE UNIQUE INDEX "IDX_5c42dcf75b1abecf9860e54a12" ON "mentor"("wix_id");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_5c7ebcd2f3fc7ed6022a478980" ON "participation_certificate"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "REL_565d757e2fd9a97fc3f30f5129" ON "project_coaching_screening"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_PROJECT_FIELDS" ON "project_field_with_grade_restriction"("projectField", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_58dbaf83a377f347d9fab47fc5" ON "project_match"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_PJ_MATCH" ON "project_match"("studentId", "pupilId");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_24d523169870b7e80f9e68aad3" ON "pupil"("email");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_90fde657ec008e61a5b07947b3" ON "pupil"("verification");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_16c46adbb2885e591364e476e5" ON "pupil"("wix_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_530c5238700824af32352324363" ON "pupil"("coduToken");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_8108668f1658b14b9db299634e" ON "pupil_tutoring_interest_confirmation_request"("token");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_2ede2092e5c464510c99fcfd05" ON "remission_request"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "REL_5b96e9df53055059ad903ebc98" ON "remission_request"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_b365d0ef66facdfeb842d45683" ON "school"("website");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_f3f92f9182a7fccc2858fd63cc" ON "school"("emailDomain");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_29a6207bc70a2b9e6731d66bcf" ON "screener"("email");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_c9e25ecca022d0d6cd401d9e5e" ON "screener"("verification");


-- CreateIndex
CREATE UNIQUE INDEX "UQ_96dc11de485d62615e78a875293" ON "screener"("oldNumberID");

-- CreateIndex
CREATE UNIQUE INDEX "REL_dfb78fd7887c69e3c52e002083" ON "screening"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_a56c051c91dbe1068ad683f536" ON "student"("email");
    
-- CreateIndex
CREATE UNIQUE INDEX "IDX_34cbafcb0bcdfb2b6de9010acb" ON "student"("verification");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_545d0c66310ca5df98b4765cc7" ON "student"("wix_id");

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
CREATE UNIQUE INDEX "REL_11ea2a4aad67ab6428a6ca21b4" ON "certificate_of_conduct"("studentId");

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "FK_0682a6fe3bace3ed13377c1b1ca" FOREIGN KEY ("correspondentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_attendance_log" ADD CONSTRAINT "FK_927959c3480126ecdceeae26609" FOREIGN KEY ("lectureId") REFERENCES "lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_attendance_log" ADD CONSTRAINT "FK_acc59dc4321a888376f7fad5a3d" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_guest" ADD CONSTRAINT "FK_4392726b6462358a809db822af4" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_guest" ADD CONSTRAINT "FK_a0843258a46daa7d91dc2cef917" FOREIGN KEY ("inviterId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_instructors_student" ADD CONSTRAINT "FK_54bce9a9a93ae130beaa70bb2fa" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_instructors_student" ADD CONSTRAINT "FK_66b47860afa3098729925338c18" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_participation_certificate" ADD CONSTRAINT "FK_585aa209315fc328d48af2765b4" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_participation_certificate" ADD CONSTRAINT "FK_bc6a26ac82132b6e9f1d6de3e4c" FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_participation_certificate" ADD CONSTRAINT "FK_d03c3421018dd300f5e9061ae87" FOREIGN KEY ("issuerId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_tags_course_tag" ADD CONSTRAINT "FK_af4499c3ae1153ac06782b2e5b9" FOREIGN KEY ("courseTagId") REFERENCES "course_tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_tags_course_tag" ADD CONSTRAINT "FK_d6261ad9de1fc5f06946095bf8c" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_data" ADD CONSTRAINT "FK_0bf0d1a1e138fd47f60e2635247" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "expert_data_expertise_tags_expertise_tag" ADD CONSTRAINT "FK_73044a211048e72c2026425c81c" FOREIGN KEY ("expertDataId") REFERENCES "expert_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_data_expertise_tags_expertise_tag" ADD CONSTRAINT "FK_8a81e80d1d580b868ed36ca1234" FOREIGN KEY ("expertiseTagId") REFERENCES "expertise_tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "instructor_screening" ADD CONSTRAINT "FK_e176665fa769d2e603d825f6fa3" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "instructor_screening" ADD CONSTRAINT "FK_ef1d3e862feda89b92fddcdbb34" FOREIGN KEY ("screenerId") REFERENCES "screener"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jufo_verification_transmission" ADD CONSTRAINT "FK_1ceddec34e7b90cdbb85ff9738f" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lecture" ADD CONSTRAINT "FK_087916363d2c5b483701d505a07" FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lecture" ADD CONSTRAINT "FK_2ca61c8451b53ad2da3c5f6432a" FOREIGN KEY ("instructorId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lecture" ADD CONSTRAINT "FK_5829da504d003d9aa252856574e" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "FK_38770d911dab69557a913812f3f" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "FK_89d8d61ff2bcae46513788416e4" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participation_certificate" ADD CONSTRAINT "FK_01437dc10f00eace91b0f93a805" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participation_certificate" ADD CONSTRAINT "FK_b8bb6da6b807a7b382218947647" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_coaching_screening" ADD CONSTRAINT "FK_565d757e2fd9a97fc3f30f51297" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_coaching_screening" ADD CONSTRAINT "FK_91fa06e6e9aa04b5da93d034cae" FOREIGN KEY ("screenerId") REFERENCES "screener"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_field_with_grade_restriction" ADD CONSTRAINT "FK_8cdc7fe37faa309976893b8ad07" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_match" ADD CONSTRAINT "FK_2f269fd77a19a301eb7c9aaa6b6" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_match" ADD CONSTRAINT "FK_ec8c8527004e4b21fa92dfde9f4" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pupil" ADD CONSTRAINT "FK_ed2282d6491ddb708d5b8f60225" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pupil_tutoring_interest_confirmation_request" ADD CONSTRAINT "FK_5928ac6454eee0bfbdb8e538ef8" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "remission_request" ADD CONSTRAINT "FK_5b96e9df53055059ad903ebc98c" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "screening" ADD CONSTRAINT "FK_c0b20c6342ac95d3b66c31ac30e" FOREIGN KEY ("screenerId") REFERENCES "screener"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "screening" ADD CONSTRAINT "FK_dfb78fd7887c69e3c52e0020838" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subcourse" ADD CONSTRAINT "FK_274b57f6af62ffadb80afcbae85" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subcourse_instructors_student" ADD CONSTRAINT "FK_3f0c594b9393bf4ca9ed3681967" FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcourse_instructors_student" ADD CONSTRAINT "FK_b36e4eeff8040a09cc811dbb262" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subcourse_participants_pupil" ADD CONSTRAINT "FK_47d9d98b6496554165e08ff61d9" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;


-- AddForeignKey
ALTER TABLE "subcourse_participants_pupil" ADD CONSTRAINT "FK_cde91c063947d1302d50c906dcd" FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcourse_waiting_list_pupil" ADD CONSTRAINT "FK_3bd25f377afc44f574f7ac3d09b" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subcourse_waiting_list_pupil" ADD CONSTRAINT "FK_df9eb9663f8085da35f7ca55471" FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_of_conduct" ADD CONSTRAINT "FK_11ea2a4aad67ab6428a6ca21b41" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "message_translation" ADD CONSTRAINT "FK_5ae486c5ef53f5335af8a4ae260" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pupil_screening" ADD CONSTRAINT "FK_d53a566dbe1a58b06bea8b51c1d" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "waiting_list_enrollment" ADD CONSTRAINT "FK_4c3bda70e61547bcdb61e85a110" FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "waiting_list_enrollment" ADD CONSTRAINT "FK_c019519c21578e119799586d7ed" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

