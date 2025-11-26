-- CreateTable
CREATE TABLE "Tent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "capacity" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "lastInspected" DATETIME NOT NULL,
    "missingItems" TEXT NOT NULL DEFAULT '[]',
    "damagedItems" TEXT NOT NULL DEFAULT '[]',
    "location" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
