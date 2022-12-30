-- This file will be removed after migration is created

CREATE TYPE "notification_type_enum" AS ENUM (
	    'chat',
        'survey',
        'appointment',
        'advice',
        'suggestion',
        'announcement',
        'call',
        'news',
        'event',
        'request',
        'alternative',
        'account',
        'onboarding',
        'match',
        'course',
        'certificate',
        'legacy');

ALTER TABLE "notification" ADD COLUMN "type" "notification_type_enum" NOT NULL DEFAULT 'legacy';
ALTER TABLE "notification" DROP COLUMN "category";

CREATE TYPE "app_language_enum" AS ENUM (
	    'de',
        'en');

CREATE TABLE "notification_template" (
    id serial4 NOT NULL,
    "notificationId" int4 NOT NULL,
    "template" json NOT NULL,
    "language" "app_language_enum" NOT NULL DEFAULT 'de',
    PRIMARY KEY ("id"),
    FOREIGN KEY("notificationId") REFERENCES "notification"("id")
);