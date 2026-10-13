-- DropIndex
DROP INDEX "UserGame_user_id_game_id_idx";

-- CreateIndex
CREATE INDEX "Trophy_game_id_idx" ON "Trophy"("game_id");
