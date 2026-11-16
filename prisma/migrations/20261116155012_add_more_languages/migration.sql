-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "pupil_languages_enum" ADD VALUE 'Dari';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Deutsche Gebärdensprache';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Igbo';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Japanisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Paschtu';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Südkoreanisch';
ALTER TYPE "pupil_languages_enum" ADD VALUE 'Yoruba';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "student_languages_enum" ADD VALUE 'Dari';
ALTER TYPE "student_languages_enum" ADD VALUE 'Deutsche Gebärdensprache';
ALTER TYPE "student_languages_enum" ADD VALUE 'Igbo';
ALTER TYPE "student_languages_enum" ADD VALUE 'Japanisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Paschtu';
ALTER TYPE "student_languages_enum" ADD VALUE 'Südkoreanisch';
ALTER TYPE "student_languages_enum" ADD VALUE 'Yoruba';
