-- AlterTable
ALTER TABLE "achievement_template" ADD COLUMN     "progressDescription" VARCHAR,
ADD COLUMN     "streakProgress" VARCHAR;
-- AlterTable
ALTER TABLE "achievement_template" ALTER COLUMN "subtitle" DROP NOT NULL,
ALTER COLUMN "achievedImage" DROP NOT NULL;
-- AlterTable
ALTER TABLE "achievement_event" ALTER COLUMN "relation" DROP NOT NULL;
