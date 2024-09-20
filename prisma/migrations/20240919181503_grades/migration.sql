/*
  Warnings:

  - The `grades` column on the `School` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "School" DROP COLUMN "grades",
ADD COLUMN     "grades" TEXT[];
