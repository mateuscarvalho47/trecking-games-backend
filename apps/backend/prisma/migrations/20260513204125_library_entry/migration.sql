-- CreateEnum
CREATE TYPE "LibraryStatus" AS ENUM ('WISHLIST', 'BACKLOG', 'PLAYING', 'PAUSED', 'COMPLETED', 'DROPPED');

-- CreateTable
CREATE TABLE "LibraryEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "coverUrl" TEXT,
    "genres" TEXT[],
    "platforms" TEXT[],
    "status" "LibraryStatus" NOT NULL,
    "userPlatform" TEXT,
    "rating" INTEGER,
    "hoursPlayed" DECIMAL(6,1),
    "notes" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibraryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LibraryEntry_userId_status_idx" ON "LibraryEntry"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "LibraryEntry_userId_igdbId_key" ON "LibraryEntry"("userId", "igdbId");

-- AddForeignKey
ALTER TABLE "LibraryEntry" ADD CONSTRAINT "LibraryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
