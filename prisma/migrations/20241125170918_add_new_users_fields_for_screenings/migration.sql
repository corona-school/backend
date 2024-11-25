-- CreateEnum
CREATE TYPE "gender_enum" AS ENUM ('male', 'female', 'other');

-- AlterTable
ALTER TABLE "pupil" ADD COLUMN     "descriptionForMatch" VARCHAR NOT NULL DEFAULT '',
ADD COLUMN     "descriptionForScreening" VARCHAR NOT NULL DEFAULT '',
ADD COLUMN     "hasSpecialNeeds" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onlyMatchWithWomen" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "descriptionForMatch" VARCHAR NOT NULL DEFAULT '',
ADD COLUMN     "gender" "gender_enum",
ADD COLUMN     "hasSpecialExperience" BOOLEAN NOT NULL DEFAULT false;
