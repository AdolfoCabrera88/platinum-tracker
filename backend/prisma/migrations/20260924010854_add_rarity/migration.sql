/*
  Warnings:

  - You are about to drop the column `tier` on the `Trophy` table. All the data in the column will be lost.
  - Added the required column `grade` to the `Trophy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rarity` to the `Trophy` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('PLATINUM', 'GOLD', 'SILVER', 'BRONZE');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'VERY_RARE', 'RARE', 'ULTRA_RARE');

-- AlterTable
ALTER TABLE "Trophy" DROP COLUMN "tier",
ADD COLUMN     "grade" "Grade" NOT NULL,
ADD COLUMN     "rarity" "Rarity" NOT NULL;

-- DropEnum
DROP TYPE "Tier";
