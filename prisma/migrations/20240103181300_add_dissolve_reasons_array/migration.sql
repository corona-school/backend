-- AlterTable
ALTER TABLE "match" ADD COLUMN     "dissolveReasons" "dissolve_reason"[] DEFAULT ARRAY[]::"dissolve_reason"[];
