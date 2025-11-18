-- CreateEnum
CREATE TYPE "TentStatus" AS ENUM ('good', 'needs_repair', 'missing_items');

-- CreateTable
CREATE TABLE "Tent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" "TentStatus" NOT NULL,
    "condition" TEXT NOT NULL,
    "lastInspected" TIMESTAMP(3) NOT NULL,
    "missingItems" TEXT[],
    "damagedItems" TEXT[],
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tent_pkey" PRIMARY KEY ("id")
);
