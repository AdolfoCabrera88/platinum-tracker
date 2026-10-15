import 'dotenv/config';
import express from 'express';
import { body, validationResult } from 'express-validator';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.ts';
import cookieParser from 'cookie-parser';
import { requireAuth, optionalAuth } from './middleware/auth.js';
import path from 'path';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;
const distPath = path.join(import.meta.dirname, '../frontend/dist');
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
  const userCount = await prisma.user.count();
  res.json({ status: "ok", userCount: userCount });
  } catch (err) {
        console.error(err); // full detail stays in YOUR terminal, not the response
        res.status(400).json({ error: 'Invalid user count request' });
    }
});

// Get all games
app.get('/api/games' , async (req, res) =>{
    try {
    const games = await prisma.game.findMany();
    res.json(games);

    } catch (err) {
        console.error(err); // full detail stays in YOUR terminal, not the response
        res.status(400).json({ error: 'Invalid game request' });
    }
});

// Get a specific game by ID, including its trophies
app.get('/api/games/:id', optionalAuth, async (req, res) => {
    try {
        const game = await prisma.game.findUnique({
            where: { id: req.params.id },
            include: { trophies: true }
        });
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        let userStatus = null;
        if (req.userId) {
            const userGame = await prisma.userGame.findUnique({
                where: {
                    user_id_game_id: {
                        user_id: req.userId,
                        game_id: req.params.id
                    }
                }
            });
            userStatus = userGame ? userGame.status : null;
        }
        let trophiesWithStatus = game.trophies;
        if (req.userId) {
            const trophyIds = game.trophies.map(t => t.id);
            const userTrophies = await prisma.userTrophy.findMany({
                where: { user_id: req.userId, trophy_id: { in: trophyIds } }
            });
            trophiesWithStatus = game.trophies.map(trophy => {
            const ut = userTrophies.find(u => u.trophy_id === trophy.id);
                return { ...trophy, earned: ut ? ut.earned : false, earned_at: ut ? ut.earned_at : null };
            });
        }
        res.json({ ...game, trophies: trophiesWithStatus, userStatus });
    } catch (err) {
        console.error(err); // full detail stays in YOUR terminal, not the response
        res.status(400).json({ error: 'Invalid game id' });
    }
});

    // Middleware to validate user input for registration
    const validateUserInput = [
    // check all fields exists
        body('username')
        .exists({ checkFalsy: true }).withMessage('Username is required')
        .isLength({ min:3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

    body('email')
        .exists({ checkFalsy: true }).withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .exists({ checkFalsy: true }).withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character (@$!%*?&)'),
    ];

// User registration endpoint
app.post('/api/auth/register', validateUserInput, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, email, password } = req.body;
        // Add your user registration logic here
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password_hash: hashedPassword
            }
        });
        const { password_hash, ...safeUser } = newUser;
        res.status(201).json({ message: 'User registered successfully', user: safeUser });
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User login endpoint
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body; 
    try {
        const user = await prisma.user.findFirst({ 
            where: { username: username }
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        const expiresInSeconds = Number(process.env.JWT_EXPIRATION_TIME); // convert to a number of seconds

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: expiresInSeconds });
        res.cookie('token', token, { httpOnly: true, secure: isProduction, maxAge: expiresInSeconds * 1000 });
        res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: isProduction });
    res.status(200).json({ message: 'Logout successful' });
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true, email: true }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/games/:id/library', requireAuth, async (req, res) => {
    const status = req.body.status;
    const validStatuses = ['WANT_TO_PLAY', 'PLAYING', 'COMPLETED', 'PLATINUM'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }
    if (status === 'PLATINUM') {
       return res.status(400).json({ error: 'Platinum status can only be set by recording a Platinum' });
    }
    try {
        // Check if the user already has this game in their library
        const existingUserGame = await prisma.userGame.findUnique({
            where: { user_id_game_id: {
                 user_id: req.userId,
                  game_id: req.params.id
                } 
            }
        });

        // Upsert the user's game in their library
        const result = await prisma.userGame.upsert({ 
            where: { user_id_game_id: {
                 user_id: req.userId,
                  game_id: req.params.id
                } 
            },
            update: { status }, 
            create: { user_id: req.userId, game_id: req.params.id, status } 
        });

        // If the game was not previously in the user's library, create user trophies for it
        if(!existingUserGame) {
            const trophies = await prisma.trophy.findMany({
                where: { game_id: req.params.id }
            });

            await prisma.userTrophy.createMany({
                data: trophies.map(trophy => ({
                    user_id: req.userId,
                    trophy_id: trophy.id,
                    earned: false
                }))
            });
        }
        res.status(200).json({ message: 'Library updated successfully', data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.patch('/api/trophies/:trophyId/progress', requireAuth, async (req, res) => {
    if(typeof req.body.earned !== 'boolean') {
        return res.status(400).json({ error: 'Invalid earned value' });
    }

    try {
        const existingUserTrophy = await prisma.userTrophy.findUnique({
            where: { user_id_trophy_id: {
                user_id: req.userId,
                trophy_id: req.params.trophyId
            } }
        });

        if(!existingUserTrophy) {
            return res.status(404).json({ error: 'User trophy not found' });
        }

        const updatedUserTrophy = await prisma.userTrophy.update({
            where: { user_id_trophy_id: {
                user_id: req.userId,
                trophy_id: req.params.trophyId
            } },
            data: { earned: req.body.earned, earned_at: req.body.earned ? new Date() : null }
        });

        res.status(200).json({ message: 'User trophy updated successfully', data: updatedUserTrophy });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/games/:id/platinum', requireAuth, async (req, res) => {
    const { personal_difficulty, hours_spent, notes } = req.body;
    if(typeof personal_difficulty !== 'number' || typeof hours_spent !== 'number' || typeof notes !== 'string') {
        return res.status(400).json({ error: 'Invalid input' });
    }
    if(personal_difficulty < 1 || personal_difficulty > 10) {
        return res.status(400).json({ error: 'Personal difficulty must be between 1 and 10' });
    }

    try {
    const userTrophies = await prisma.userTrophy.findMany({
        where: {
            user_id: req.userId,
            trophy: {
                game_id: req.params.id
            }
        }
    });

    const totalTrophies = await prisma.trophy.count({
        where: {
            game_id: req.params.id
        }
    });

    const allEarned = 
        userTrophies.length === totalTrophies &&
        userTrophies.every(trophy => trophy.earned);
    if(!allEarned) {
        return res.status(409).json({ error: 'Cannot create platinum record unless all trophies are earned' });
    }

        const platinum = await prisma.platinumRecord.create({
            data: {
                user_id: req.userId,
                game_id: req.params.id,
                personal_difficulty,
                hours_spent,
                notes
            }
        });

        
        await prisma.userGame.update({
            where: { user_id_game_id: {
                user_id: req.userId,
                game_id: req.params.id
                } 
            },
            data: { status: 'PLATINUM' }
        });
        
        res.status(201).json({ message: 'Platinum created successfully', data: platinum });
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Platinum already recorded for this game' });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/profile/stats', requireAuth, async (req, res) => {
    try {
        const profileStats = await prisma.platinumRecord.aggregate({
            where: {
                user_id: req.userId
            }, 
            _count: true, _avg: { personal_difficulty: true, hours_spent: true }, 
                _max: { hours_spent: true },
                 _min: {  hours_spent: true } 
            });

        const hardest = await prisma.platinumRecord.findFirst({
            where: {
                user_id: req.userId
            },
            orderBy: {
                personal_difficulty: 'desc'
            },
            include: {game: true}
        });

        const easiest = await prisma.platinumRecord.findFirst({
            where: {
                user_id: req.userId
            },
            orderBy: {
                personal_difficulty: 'asc'
            },
            include: {game: true}
        });

        const totalGames = await prisma.userGame.count({
            where: {
                user_id: req.userId
            }
        });

        const totalTrophiesEarned = await prisma.userTrophy.count({
            where: {
                user_id: req.userId,
                earned: true 
            },
        });

        res.status(200).json({ 
            totalPlatinum: profileStats._count,
            avgDifficulty: profileStats._avg.personal_difficulty ?? 0,
            avgHours: profileStats._avg.hours_spent ?? 0,
            longestPlatinumHours: profileStats._max.hours_spent,
            shortestPlatinumHours: profileStats._min.hours_spent,
            hardestPlatinum: hardest ? { difficulty: hardest.personal_difficulty, game: hardest.game.title } : null,
            easiestPlatinum: easiest ? { difficulty: easiest.personal_difficulty, game: easiest.game.title } : null,
            totalGames,
            totalTrophiesEarned
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/profile/journal', requireAuth, async (req, res) => {
    try {
        const journalEntries = await prisma.platinumRecord.findMany({
            where: { user_id: req.userId },
            orderBy: { platinum_date: 'desc' }, 
            include: { game: true }
        });
        res.status(200).json(journalEntries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.use(express.static(distPath));
app.use((req, res) => {
    // if the path starts with /api or if the method is not GET -> respond with a JSON 404
    if (req.path.startsWith('/api') || req.method !== 'GET') {
        return res.status(404).json({ error: 'Not Found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling middleware for invalid requests
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: 'Invalid request' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});