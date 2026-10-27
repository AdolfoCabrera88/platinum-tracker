import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {

     const trophies = [
                    { name: 'Power Couple', description: 'You are unstoppable, nothing stands in your way!', missable: false, grade: 'PLATINUM', rarity: 'ULTRA_RARE' },
                    { name: 'It Took Two', description: 'You did it! CO-LLA-BO-RATION!', missable: false, grade: 'GOLD', rarity: 'RARE' },
                    { name: 'Minigame Megalomania', description: 'All minigames found!', missable: false, grade: 'GOLD', rarity: 'ULTRA_RARE' },
                    { name: 'Fried Friendship', description: 'It takes two to… torture.', missable: false, grade: 'BRONZE', rarity: 'COMMON' },
                    { name: 'Struck A Pose', description: 'Self-inflicted paparazzi.', missable: false, grade: 'BRONZE', rarity: 'COMMON' },
                    { name: 'Plastic Prison Breakers', description: 'They had no way out.', missable: false, grade: 'GOLD', rarity: 'VERY_RARE' },
                    { name: 'Faraway Frequencies', description: 'The truth was out there all along!', missable: false, grade: 'BRONZE', rarity: 'VERY_RARE' },
                    { name: 'Look At Him Go', description: 'Shoot for the stars, literally.', missable: false, grade: 'BRONZE', rarity: 'COMMON' },
                    { name: 'Break The Bank', description: 'Guess it was time to cash out.', missable: false, grade: 'GOLD', rarity: 'RARE' },
                    { name: 'Daring Devil', description: 'Put on a show and die trying.', missable: false, grade: 'GOLD', rarity: 'RARE' },
                    { name: 'Snackosaurus', description: "Now look who's extinct!", missable: false, grade: 'BRONZE', rarity: 'VERY_RARE' },
                    { name: 'Realize Your Art', description: "Isn't it pretty? That's going on the fridge.", missable: false, grade: 'GOLD', rarity: 'VERY_RARE' },
                    { name: 'On Rails Experience', description: 'Choo Choo!', missable: false, grade: 'GOLD', rarity: 'RARE' },
                    { name: 'Platforming Prodigy', description: 'Helltower? More like hello-from-up-here-tower!', missable: false, grade: 'GOLD', rarity: 'VERY_RARE' },
                    { name: 'Force Triangulated', description: 'Breathe some wind into your ocarina, my skyward princess!', missable: false, grade: 'GOLD', rarity: 'VERY_RARE' },
                    { name: 'Lost And Found', description: 'Again? Keep track of your kids!', missable: false, grade: 'BRONZE', rarity: 'VERY_RARE' },
                    { name: 'Mood Swing', description: "Took things a bit too far, didn't you?", missable: false, grade: 'GOLD', rarity: 'VERY_RARE' },
                    { name: 'Something Fishy', description: "Don't feed the animals! Or do, they're adorable.", missable: false, grade: 'BRONZE', rarity: 'VERY_RARE' },
                    { name: 'Terror Of The Seven Seas', description: 'Scurvy! Ye look smashing, captain!', missable: false, grade: 'BRONZE', rarity: 'VERY_RARE' },
                    { name: 'Bug Sized Relaxation', description: 'Release that tension at the root level.', missable: false, grade: 'BRONZE', rarity: 'VERY_RARE' },
                    { name: 'Meditation Maestro', description: 'You reached a higher state of mind. \nOr at least some peace and quiet', missable: false, grade: 'BRONZE', rarity: 'VERY_RARE' },
                ]

    const game = await prisma.game.create({
        data:{
            cover_url: 'https://cdn.mobygames.com/covers/11068330-it-takes-two-nintendo-switch-front-cover.jpg',
            title: 'It Takes Two',
            game_description: `It Takes Two follows Cody and May, a married couple transformed into living dolls by a magical spell created by their daughter, Rose, after learning of their impending divorce. The couple must work together to navigate a fantastical world, overcome obstacles, and repair their fractured relationship to return to their human bodies. The game emphasizes collaboration, with each player controlling one character and using unique abilities that complement each other.`,
            release_date: new Date('2021-03-26'),
            platforms: ['PC', 'PlayStation 4', 'PlayStation 5', 'Xbox One', 'Xbox Series X/S', 'Nintendo Switch', 'Nintendo Switch 2'],
            trophies: {
                create: trophies.map((trophy, index) => ({ ...trophy, sort_order: index }))
            }
        }
    })
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })