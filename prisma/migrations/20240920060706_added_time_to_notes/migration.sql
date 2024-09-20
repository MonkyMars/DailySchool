/*
  Warnings:

  - Added the required column `time` to the `Notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;
