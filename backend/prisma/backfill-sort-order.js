import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const gameTitle = 'It Takes Two';

const trophyNames = [
    'Power Couple',
    'It Took Two',
    'Minigame Megalomania',
    'Fried Friendship',
    'Struck A Pose',
    'Plastic Prison Breakers',
    'Faraway Frequencies',
    'Look At Him Go',
    'Break The Bank',
    'Daring Devil',
    'Snackosaurus',
    'Realize Your Art',
    'On Rails Experience',
    'Platforming Prodigy',
    'Force Triangulated',
    'Lost And Found',
    'Mood Swing',
    'Something Fishy',
    'Terror Of The Seven Seas',
    'Bug Sized Relaxation',
    'Meditation Maestro'
];

async function main() {
    const game = await prisma.game.findFirst({ where: { title: gameTitle } });
    if (!game) {
        console.log('Game not found');
        return;
    }

    for (const [index, name] of trophyNames.entries()) {
        const result = await prisma.trophy.updateMany({
            where: { game_id: game.id, name },
            data: { sort_order: index }
        });
        if (result.count === 0) console.log('No match for:', name);
    }
    console.log('Done');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })