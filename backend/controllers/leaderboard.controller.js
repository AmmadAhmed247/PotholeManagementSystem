// controllers/leaderboard.controller.js
import { LeaderboardBST } from '../services/bstLeaderboard.js';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

// shared in-memory leaderboard
export const leaderboard = new LeaderboardBST();

/**
 * Rebuild leaderboard from MongoDB on server start
 * This ensures counts persist even after a server restart
 */
export const rebuildLeaderboard = async () => {
  try {
    const users = await User.find();
    for (const user of users) {
      const count = await Complaint.countDocuments({ user: user._id });
      leaderboard.setCount(user._id, user.name, count); // implement setCount in your BST
    }
    console.log('Leaderboard rebuilt from DB');
  } catch (err) {
    console.error('Error rebuilding leaderboard:', err);
  }
};

// Call this function in your server.js or main file after DB connection
// rebuildLeaderboard().catch(err => console.error(err));

/**
 * Increment user's complaint count when a complaint is filed
 */
export const addComplaint = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    leaderboard.addComplaint(userId, user.name);

    res.json({ message: 'Complaint added', top: leaderboard.topN(10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get top N users from leaderboard
 */
export const getLeaderboard = (req, res) => {
  res.json({ top: leaderboard.topN(10) });
};
