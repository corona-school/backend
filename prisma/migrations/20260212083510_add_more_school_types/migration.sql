-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "course_schooltype_enum" ADD VALUE 'mittelschule';
ALTER TYPE "course_schooltype_enum" ADD VALUE 'oberschule';
ALTER TYPE "course_schooltype_enum" ADD VALUE 'sekundarschule';
ALTER TYPE "course_schooltype_enum" ADD VALUE 'stadtteilschule';
ALTER TYPE "course_schooltype_enum" ADD VALUE 'berufsfachschule';
ALTER TYPE "course_schooltype_enum" ADD VALUE 'fachoberschule';
ALTER TYPE "course_schooltype_enum" ADD VALUE 'berufsoberschule';
ALTER TYPE "course_schooltype_enum" ADD VALUE 'oberstufenzentrum';
ALTER TYPE "course_schooltype_enum" ADD VALUE 'fachschule';
ALTER TYPE "course_schooltype_enum" ADD VALUE 'abendschule_vhs';
ALTER TYPE "course_schooltype_enum" ADD VALUE 'berufskolleg';
ALTER TYPE "course_schooltype_enum" ADD VALUE 'beruflichesgymnasium';
ALTER TYPE "course_schooltype_enum" ADD VALUE 'uni_studienkolleg';
ALTER TYPE "course_schooltype_enum" ADD VALUE 'auslandsschule';
ALTER TYPE "course_schooltype_enum" ADD VALUE 'privatschule';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'mittelschule';
ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'oberschule';
ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'sekundarschule';
ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'stadtteilschule';
ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'berufsfachschule';
ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'fachoberschule';
ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'berufsoberschule';
ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'oberstufenzentrum';
ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'fachschule';
ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'abendschule_vhs';
ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'berufskolleg';
ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'beruflichesgymnasium';
ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'uni_studienkolleg';
ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'auslandsschule';
ALTER TYPE "pupil_schooltype_enum" ADD VALUE 'privatschule';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "school_schooltype_enum" ADD VALUE 'mittelschule';
ALTER TYPE "school_schooltype_enum" ADD VALUE 'oberschule';
ALTER TYPE "school_schooltype_enum" ADD VALUE 'sekundarschule';
ALTER TYPE "school_schooltype_enum" ADD VALUE 'stadtteilschule';
ALTER TYPE "school_schooltype_enum" ADD VALUE 'berufsfachschule';
ALTER TYPE "school_schooltype_enum" ADD VALUE 'fachoberschule';
ALTER TYPE "school_schooltype_enum" ADD VALUE 'berufsoberschule';
ALTER TYPE "school_schooltype_enum" ADD VALUE 'oberstufenzentrum';
ALTER TYPE "school_schooltype_enum" ADD VALUE 'fachschule';
ALTER TYPE "school_schooltype_enum" ADD VALUE 'abendschule_vhs';
ALTER TYPE "school_schooltype_enum" ADD VALUE 'berufskolleg';
ALTER TYPE "school_schooltype_enum" ADD VALUE 'beruflichesgymnasium';
ALTER TYPE "school_schooltype_enum" ADD VALUE 'uni_studienkolleg';
ALTER TYPE "school_schooltype_enum" ADD VALUE 'auslandsschule';
ALTER TYPE "school_schooltype_enum" ADD VALUE 'privatschule';
