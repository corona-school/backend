-- AlterTable
ALTER TABLE "pupil_screening" ADD COLUMN     "screenerIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
