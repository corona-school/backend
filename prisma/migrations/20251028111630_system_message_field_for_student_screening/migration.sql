-- AlterTable
ALTER TABLE "instructor_screening" ADD COLUMN     "systemMessages" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "screening" ADD COLUMN     "systemMessages" TEXT[] DEFAULT ARRAY[]::TEXT[];
