-- CreateEnum
CREATE TYPE "cooperation_type_enum" AS ENUM ('company', 'university');

-- AlterTable
ALTER TABLE "cooperation" ADD COLUMN     "type" "cooperation_type_enum" NOT NULL DEFAULT 'company';
