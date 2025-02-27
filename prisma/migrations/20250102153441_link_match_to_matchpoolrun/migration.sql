-- AlterTable
ALTER TABLE "match" ADD COLUMN     "matchPoolRunId" INTEGER;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_matchPoolRunId_fkey" FOREIGN KEY ("matchPoolRunId") REFERENCES "match_pool_run"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
