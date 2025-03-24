-- AlterTable
ALTER TABLE "student" ADD COLUMN     "cooperationID" INTEGER;

-- CreateTable
CREATE TABLE "cooperation" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "welcomeTitle" TEXT NOT NULL,
    "welcomeMessage" TEXT NOT NULL,

    CONSTRAINT "cooperation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_cooperationID_fkey" FOREIGN KEY ("cooperationID") REFERENCES "cooperation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

Select * lkjdf;
