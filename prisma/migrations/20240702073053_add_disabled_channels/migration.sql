-- CreateEnum
CREATE TYPE "notification_channel_enum" AS ENUM ('email', 'inapp', 'push');

-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "disabledChannels" "notification_channel_enum"[] DEFAULT ARRAY[]::"notification_channel_enum"[];
