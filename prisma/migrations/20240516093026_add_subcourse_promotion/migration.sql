-- CreateEnum
CREATE TYPE "subcourse_promotion_type_enum" AS ENUM ('system', 'instructor', 'admin');

-- CreateTable
CREATE TABLE "subcourse_promotion" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "subcourse_promotion_type_enum" NOT NULL,
    "subcourseId" INTEGER NOT NULL,

    CONSTRAINT "subcourse_promotion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subcourse_promotion" ADD CONSTRAINT "subcourse_promotion_subcourseId_fkey" FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
