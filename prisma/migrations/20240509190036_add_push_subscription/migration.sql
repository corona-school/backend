-- CreateTable
CREATE TABLE "push_subscription" (
    "id" SERIAL NOT NULL,
    "userID" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "expirationTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "push_subscription_pkey" PRIMARY KEY ("id")
);
