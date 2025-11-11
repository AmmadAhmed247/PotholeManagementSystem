import express from 'express';
import { addComplaint, getLeaderboard } from '../controllers/leaderboard.controller.js';

const router = express.Router();

// Add complaint (increments user count)
router.post('/leaderboard/complaint', addComplaint);

// Get top 10 users
router.get('/leaderboard', getLeaderboard);

export default router;
