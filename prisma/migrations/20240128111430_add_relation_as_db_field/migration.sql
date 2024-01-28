-- AlterTable
ALTER TABLE "user_achievement" ADD COLUMN     "relation" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_achievement_relation_userId_templateId_key" ON "user_achievement"("relation", "userId", "templateId");
