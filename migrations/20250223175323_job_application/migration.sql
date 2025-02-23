/*
  Warnings:

  - You are about to drop the column `interviteDate` on the `JobApplication` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "flexibility" TEXT,
    "location" TEXT,
    "status" TEXT NOT NULL,
    "interviewDate" DATETIME,
    "interviewer" TEXT,
    "link" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JobApplication" ("company", "createdAt", "flexibility", "id", "interviewer", "link", "location", "notes", "position", "status", "updatedAt", "userId") SELECT "company", "createdAt", "flexibility", "id", "interviewer", "link", "location", "notes", "position", "status", "updatedAt", "userId" FROM "JobApplication";
DROP TABLE "JobApplication";
ALTER TABLE "new_JobApplication" RENAME TO "JobApplication";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
