-- CreateTable
CREATE TABLE "linkedInToken" (
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "linkedInToken_pkey" PRIMARY KEY ("userId")
);
