/*
  Warnings:

  - You are about to drop the column `trophy_description` on the `Trophy` table. All the data in the column will be lost.
  - Added the required column `description` to the `Trophy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trophy" DROP COLUMN "trophy_description",
ADD COLUMN     "description" TEXT NOT NULL;
