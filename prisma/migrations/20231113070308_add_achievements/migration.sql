-- CreateEnum
CREATE TYPE "achievement_template_for_enum" AS ENUM ('Course', 'Global_Courses', 'Match', 'Global_Matches', 'Global');

-- CreateEnum
CREATE TYPE "achievement_type_enum" AS ENUM ('SEQUENTIAL', 'TIERED', 'STREAK');

-- CreateEnum
CREATE TYPE "achievement_action_type_enum" AS ENUM ('Appointment', 'Action', 'Wait', 'Info');

-- CreateTable
CREATE TABLE "achievement_template" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "metrics" TEXT[],
    "templateFor" "achievement_template_for_enum" NOT NULL,
    "group" VARCHAR NOT NULL,
    "groupOrder" INTEGER NOT NULL,
    "stepName" VARCHAR NOT NULL,
    "type" "achievement_type_enum" NOT NULL,
    "subtitle" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "image" VARCHAR NOT NULL,
    "actionName" VARCHAR,
    "actionRedirectLink" VARCHAR,
    "actionType" "achievement_action_type_enum",
    "achievedText" VARCHAR,
    "condition" VARCHAR NOT NULL,
    "conditionDataAggregations" JSON NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "achievement_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievement" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "group" VARCHAR NOT NULL,
    "groupOrder" INTEGER NOT NULL,
    "isSeen" BOOLEAN NOT NULL DEFAULT false,
    "achievedAt" TIMESTAMP(6),
    "recordValue" INTEGER,
    "context" JSON NOT NULL,

    CONSTRAINT "user_achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievement_event" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR NOT NULL,
    "metric" VARCHAR NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" VARCHAR NOT NULL,
    "relation" VARCHAR NOT NULL,

    CONSTRAINT "achievement_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_achievement_group_key" ON "user_achievement"("group");

-- AddForeignKey
ALTER TABLE "user_achievement" ADD CONSTRAINT "user_achievement_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "achievement_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
