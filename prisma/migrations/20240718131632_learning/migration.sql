-- CreateEnum
CREATE TYPE "learning_assignment_status" AS ENUM ('pending', 'in_progress', 'done');

-- CreateEnum
CREATE TYPE "learning_note_type" AS ENUM ('question', 'answer', 'correct_answer', 'wrong_answer', 'task', 'comment');

-- CreateTable
CREATE TABLE "learning_topic" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pupilId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "subject" "course_subject_enum" NOT NULL,
    "matchId" INTEGER,

    CONSTRAINT "learning_topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_assignment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topicId" INTEGER NOT NULL,
    "task" TEXT NOT NULL,
    "status" "learning_assignment_status" NOT NULL,

    CONSTRAINT "learning_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_note" (
    "id" SERIAL NOT NULL,
    "type" "learning_note_type" NOT NULL,
    "authorID" TEXT,
    "authorName" TEXT NOT NULL,
    "topicId" INTEGER,
    "assignmentId" INTEGER,
    "text" TEXT NOT NULL,
    "replyToId" INTEGER,

    CONSTRAINT "learning_note_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "learning_topic" ADD CONSTRAINT "learning_topic_pupilId_fkey" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "learning_topic" ADD CONSTRAINT "learning_topic_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "learning_assignment" ADD CONSTRAINT "learning_assignment_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "learning_topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "learning_note" ADD CONSTRAINT "learning_note_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "learning_topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "learning_note" ADD CONSTRAINT "learning_note_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "learning_assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "learning_note" ADD CONSTRAINT "learning_note_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "learning_note"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
