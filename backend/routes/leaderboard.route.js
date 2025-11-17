import express from 'express';
import { addComplaint, getLeaderboard } from '../controllers/leaderboard.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Only logged-in users can add complaint
router.post('/leaderboard/complaint', authMiddleware, addComplaint);

// Anyone can view leaderboard
router.get('/leaderboard', getLeaderboard);

export default router;
