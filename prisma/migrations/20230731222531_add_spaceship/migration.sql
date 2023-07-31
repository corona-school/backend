-- CreateTable
CREATE TABLE "spaceship" (
    "name" TEXT NOT NULL,
    "planet" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "spaceship_name_key" ON "spaceship"("name");
