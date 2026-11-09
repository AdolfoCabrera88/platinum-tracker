import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

//game files
import itTakesTwo from './seedData/it_takes_two.js';
import biped from './seedData/biped.js';
import bloodborne from './seedData/bloodborne.js';
import modernWarfare3 from './seedData/modern_warfare®_3.js';
import godOfWar from './seedData/god_of_war.js';
import minecraft from './seedData/minecraft.js';
import theLastOfUs from './seedData/the_last_of_us_remastered.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {

    const games = [itTakesTwo, biped, bloodborne, modernWarfare3, godOfWar, minecraft, theLastOfUs];

    for (const seedGame of games) {
        const { trophies, ...gameFields } = seedGame;

       const existingGame = await prisma.game.findFirst({
            where: {
                title: gameFields.title
            }
        });
        if (existingGame) {
            console.log(`Game "${gameFields.title}" already exists. Skipping...`);
            continue;
        }
        if (!trophies || trophies.length === 0) {
            console.log(`Game "${gameFields.title}" has no trophies. Skipping...`);
            continue;
        }

        const platinumTrophies = trophies.filter(t => t.grade === 'PLATINUM');
        if (platinumTrophies.length > 1) {
            console.log(`Game "${gameFields.title}" can not have more than one PLATINUM trophy. Skipping...`);
            continue;
        }
    

        const createdGame = await prisma.game.create({
            data: {
                ...gameFields,
                trophies: {
                    create: trophies.map((t, i) => ({
                        ...t,
                        sort_order: i
                    })),
                },
            },
        });

        console.log(`Created game: ${createdGame.title}`);
    }
 
}

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 