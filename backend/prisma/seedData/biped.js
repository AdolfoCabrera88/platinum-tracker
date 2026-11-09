import { t } from './helper.js';
    
    export default {
                cover_url: '/covers/Biped_Cover.jpg',
                title: 'Biped',
                game_description: `Biped is a fast-paced, physics-based platformer where players control a robot with two legs, navigating through challenging environments and solving puzzles. The game emphasizes creative problem-solving and precise movement mechanics.`,
                release_date: new Date('2020-03-26'),
                platforms: ['PlayStation 5', 'Nintendo Switch', 'PlayStation 4', 'Xbox One', 'PC'],
                trophies: [
                    t('You did it!', 'Get all the trophies for the game', false, 'PLATINUM', 'ULTRA_RARE'),
                    t('First Step', 'Complete Training 2P level', false, 'BRONZE', 'RARE'),
                    t('Dense Forest', 'Complete Dense Forest 2 level', false, 'BRONZE', 'RARE'),
                    t('Cactus Vally', 'Complete Cactus Vally 2P level', false, 'SILVER', 'VERY_RARE'),
                    t('Rainy Ruins', 'Complete Rainy Ruins 2P level', false, 'SILVER', 'VERY_RARE'),
                    t('Snowy Peak', 'Complete Snowy Peak 2P level', false, 'SILVER', 'VERY_RARE'),
                    t('High Treetops', 'Complete High Treetops 2P level', false, 'SILVER', 'VERY_RARE'),
                    t('Blue Rapids', 'Complete Blue Rapids 2P level', false, 'GOLD', 'ULTRA_RARE'),
                    t('Sunset Ridge', 'Complete Sunset Ridge 2P level', false, 'GOLD', 'ULTRA_RARE'),
                    t('Speed walkers', 'Complete Rainy Ruins in 15 mins.', false, 'GOLD', 'ULTRA_RARE'),
                    t('Robot lives matter too', "Complete Sunset Ridge (2P) with less than 10 death", false, 'GOLD', 'ULTRA_RARE'),
                    t('Telepathic', "Complete 10 challenges with harmony greater than 90%", false, 'GOLD', 'VERY_RARE'),
                    t('Trend hunters', 'Unlock all the outfits in the store', false, 'GOLD', 'ULTRA_RARE'),
                    t('I can do this alone', 'Complete all the 1P levels', false, 'GOLD', 'ULTRA_RARE'),
                    t('Master biped', 'Complete all the Pro levels', false, 'GOLD', 'ULTRA_RARE'),
                    t('Reaching for the stars', 'Collect all the stars in all levels (Total Starts: 115)', false, 'GOLD', 'ULTRA_RARE'),
                ]
            }