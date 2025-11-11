
import { LeaderboardBST } from '../services/bstLeaderboard.js';

export const leaderboard = new LeaderboardBST();


export const addComplaint = (req, res) => {
  const { userId } = req.body; 

  if (!userId) return res.status(400).json({ message: 'User ID required' });

  leaderboard.addComplaint(userId);

  res.json({ message: 'Complaint added', top: leaderboard.topN(10) });
};

// Get current leaderboard
export const getLeaderboard = (req, res) => {
  res.json({ top: leaderboard.topN(10) });
};
