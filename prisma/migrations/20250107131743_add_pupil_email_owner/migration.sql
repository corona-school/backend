-- CreateEnum
CREATE TYPE "pupil_email_owner_enum" AS ENUM ('pupil', 'parent', 'other', 'unknown');

-- AlterTable
ALTER TABLE "pupil" ADD COLUMN     "emailOwner" "pupil_email_owner_enum" NOT NULL DEFAULT 'unknown';
