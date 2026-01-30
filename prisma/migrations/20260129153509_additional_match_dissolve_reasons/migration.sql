-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "dissolve_reason" ADD VALUE 'internshipEnded';
ALTER TYPE "dissolve_reason" ADD VALUE 'subjectMismatch';
ALTER TYPE "dissolve_reason" ADD VALUE 'genderPreference';
ALTER TYPE "dissolve_reason" ADD VALUE 'repeatedNoShows';
ALTER TYPE "dissolve_reason" ADD VALUE 'newPartnerFound';
