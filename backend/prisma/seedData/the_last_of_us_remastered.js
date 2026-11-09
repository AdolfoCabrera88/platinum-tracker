import { t } from './helper.js';

export default {
     cover_url: '/covers/TheLastofUs_Cover.jpg',
                title: 'The Last of Us Remastered',
                game_description: `The Last of Us is a post‑apocalyptic action‑adventure series created by Naughty Dog, set in a United States devastated by a fungal infection that turns humans into aggressive, cannibalistic “infected”. The story blends survival horror, emotional drama, and moral dilemmas, following a small group of survivors navigating a world where modern civilization has collapsed`,
                release_date: new Date('2014-07-29'),
                platforms: ['PlayStation 3', 'PlayStation 4', 'PlayStation 5', 'PC'],
                trophies: [
                    t(`It can't be for nothing`, 'Platinum Trophy', false, 'PLATINUM', 'ULTRA_RARE'),
                    t('Look for the Light', 'Find all Firefly Pendants', false, 'SILVER', 'ULTRA_RARE'),
                    t('Endure and Survive', 'Collect all comics', false, 'BRONZE', 'ULTRA_RARE'),
                    t('It was all just lying there', 'Find all artifacts', false, 'SILVER', 'ULTRA_RARE'),
                    t('I got this', 'Find all training manuals', false, 'BRONZE', 'ULTRA_RARE'),
                    t('Scavenger', 'Found all collectibles', false, 'GOLD', 'ULTRA_RARE'),
                    t("Let's gesr up", 'Craft every item', false, 'BRONZE', 'RARE'),
                    t('Master of Unlocking', 'Unlock all shiv doors', false, 'BRONZE', 'ULTRA_RARE'),
                    t("Everything we've been through", 'Fully upgrade Joel with supplements', false, 'SILVER', 'ULTRA_RARE'),
                    t('For emergencies only', 'Fully upgrade all weapons', false, 'GOLD', 'ULTRA_RARE'),
                    t('I want to talk about it', 'Engage in all optional conversations', false, 'SILVER', 'ULTRA_RARE'),
                    t("That's all I got", "Survive all of Ellie's jokes", false, 'GOLD', 'ULTRA_RARE'),
                    t('No Matter What - Easy', 'Complete the game on Easy', false, 'BRONZE', 'RARE'),
                    t('No Matter What - Normal', 'Complete the game on Normal', false, 'SILVER', 'RARE'),
                    t('No Matter What - Hard', 'Complete the game on Hard', false, 'SILVER', 'VERY_RARE'),
                    t('No Matter What - Survivor', 'Complete the game on Survivor', false, 'GOLD', 'ULTRA_RARE'),
                    t('The Last of Us - Easy +', 'Complete the game on Easy +', false, 'SILVER', 'ULTRA_RARE'),
                    t('The Last of Us - Normal +', 'Complete the game on Normal +', false, 'SILVER', 'ULTRA_RARE'),
                    t('The Last of Us - Hard +', 'Complete the game on Hard +', false, 'SILVER', 'ULTRA_RARE'),
                    t('The Last of Us - Survivor +', 'Complete the game on Survivor +', false, 'GOLD', 'ULTRA_RARE'),
                    t('Knowing the Basics', 'Win a game of Supply Raid and Survivors in find match', false, 'BRONZE', 'ULTRA_RARE'),
                    t('Populace', 'Build your clan to 40 people in Factions', false, 'BRONZE', 'ULTRA_RARE'),
                    t('Firefly', 'Complete Firefly Journey', false, 'GOLD', 'ULTRA_RARE'),
                    t('Hunter', 'Complete the Hunter Journey', false, 'GOLD', 'ULTRA_RARE')
                ]
}