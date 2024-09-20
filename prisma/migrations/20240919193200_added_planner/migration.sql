/*
  Warnings:

  - Added the required column `user` to the `Homework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user` to the `Notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Homework" ADD COLUMN     "user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "user" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Planner" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "user" INTEGER NOT NULL,

    CONSTRAINT "Planner_pkey" PRIMARY KEY ("id")
);
