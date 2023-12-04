-- CreateTable
CREATE TABLE "job_run" (
    "job_name" TEXT NOT NULL,
    "startedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "worker" TEXT NOT NULL,

    CONSTRAINT "job_run_pkey" PRIMARY KEY ("job_name","startedAt")
);
