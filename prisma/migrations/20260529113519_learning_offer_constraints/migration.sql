-- CreateEnum
CREATE TYPE "learning_offer_constraints_enum" AS ENUM ('ONLY_DAZ_COURSES', 'DAZ_SUBJECT_REQUIRED_FOR_MATCHING');

-- AlterTable
ALTER TABLE "pupil" ADD COLUMN     "learningOfferConstraints" "learning_offer_constraints_enum"[] DEFAULT ARRAY[]::"learning_offer_constraints_enum"[];
