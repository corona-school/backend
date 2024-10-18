-- CreateTable
CREATE TABLE "lesson_plan" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR NOT NULL,
    "subject" "course_subject_enum" NOT NULL,
    "grade" VARCHAR NOT NULL,
    "duration" INTEGER NOT NULL,
    "basicKnowledge" VARCHAR NOT NULL,
    "learningGoal" VARCHAR NOT NULL,
    "agendaExercises" VARCHAR NOT NULL,
    "assessment" VARCHAR NOT NULL,
    "homework" VARCHAR NOT NULL,
    "resources" VARCHAR NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,

    CONSTRAINT "lesson_plan_pkey" PRIMARY KEY ("id")
);
