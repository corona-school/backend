-- CreateTable
CREATE TABLE "user_idp_login" (
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "user_idp_login_pkey" PRIMARY KEY ("userId","clientId")
);
