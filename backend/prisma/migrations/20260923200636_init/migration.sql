-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('WANT_TO_PLAY', 'PLAYING', 'COMPLETED', 'PLATINUM');

-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('PLATINUM', 'GOLD', 'SILVER', 'BRONZE');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "game_description" TEXT NOT NULL,
    "cover_url" TEXT NOT NULL,
    "platforms" TEXT[],
    "release_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGame" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "status" "GameStatus" NOT NULL,

    CONSTRAINT "UserGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatinumRecord" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "platinum_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hours_spent" INTEGER NOT NULL,
    "personal_difficulty" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "PlatinumRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trophy" (
    "id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "trophy_description" TEXT NOT NULL,
    "tier" "Tier" NOT NULL,
    "missable" BOOLEAN NOT NULL,

    CONSTRAINT "Trophy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTrophy" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "trophy_id" UUID NOT NULL,
    "earned" BOOLEAN NOT NULL DEFAULT false,
    "earned_at" TIMESTAMP(3),

    CONSTRAINT "UserTrophy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "UserGame_user_id_game_id_idx" ON "UserGame"("user_id", "game_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserGame_user_id_game_id_key" ON "UserGame"("user_id", "game_id");

-- CreateIndex
CREATE UNIQUE INDEX "PlatinumRecord_user_id_game_id_key" ON "PlatinumRecord"("user_id", "game_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserTrophy_user_id_trophy_id_key" ON "UserTrophy"("user_id", "trophy_id");

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatinumRecord" ADD CONSTRAINT "PlatinumRecord_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatinumRecord" ADD CONSTRAINT "PlatinumRecord_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trophy" ADD CONSTRAINT "Trophy_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrophy" ADD CONSTRAINT "UserTrophy_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrophy" ADD CONSTRAINT "UserTrophy_trophy_id_fkey" FOREIGN KEY ("trophy_id") REFERENCES "Trophy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
