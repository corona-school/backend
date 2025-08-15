-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "pupil_languages_enum" ADD VALUE 'Amharisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Estnisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Georgisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Griechisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Hausa';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Hebräisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Hindi';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Kroatisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Lingala';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Litauisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Malayalam';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Mazedonisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Niederländisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Persisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Rumänisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Serbisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Slowakisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Somali';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Tadschikisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Thailändisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Tigrinya';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Tschechisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Ungarisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Urdu';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "student_languages_enum" ADD VALUE 'Amharisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Estnisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Georgisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Griechisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Hausa';
ALTER TYPE "student_languages_enum" ADD VALUE 'Hebräisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Hindi';
ALTER TYPE "student_languages_enum" ADD VALUE 'Kroatisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Lingala';
ALTER TYPE "student_languages_enum" ADD VALUE 'Litauisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Malayalam';
ALTER TYPE "student_languages_enum" ADD VALUE 'Mazedonisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Niederländisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Persisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Rumänisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Serbisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Slowakisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Somali';
ALTER TYPE "student_languages_enum" ADD VALUE 'Tadschikisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Thailändisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Tigrinya';
ALTER TYPE "student_languages_enum" ADD VALUE 'Tschechisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Ungarisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Urdu';

-- AlterTable
ALTER TABLE "pupil" ADD COLUMN     "age" INTEGER;
