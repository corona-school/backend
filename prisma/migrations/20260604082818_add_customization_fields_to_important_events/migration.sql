-- CreateEnum
CREATE TYPE "important_information_category_enum" AS ENUM ('event', 'high_demand', 'feedback', 'feature_update', 'holiday_info', 'news', 'important');

-- AlterTable
ALTER TABLE "important_information" ADD COLUMN     "activeFrom" TIMESTAMP(6),
ADD COLUMN     "activeUntil" TIMESTAMP(6),
ADD COLUMN     "category" "important_information_category_enum" NOT NULL DEFAULT 'important',
ADD COLUMN     "ctaLabel" TEXT;
