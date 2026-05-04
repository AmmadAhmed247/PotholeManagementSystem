import { withConnection } from '../services/Db.js';
import { LeaderboardBST } from '../services/bstLeaderboard.js';

export const leaderboard = new LeaderboardBST();

export const rebuildLeaderboard = async () => {
  try {
    const result = await withConnection((conn) =>
      conn.execute(
        `SELECT RAWTOHEX(u.id) AS id,
                u.name,
                COUNT(c.id) AS complaint_count
         FROM users u
         LEFT JOIN complaints c ON c.user_id = u.id
         GROUP BY u.id, u.name`
      )
    );

    result.rows.forEach((row) => {
      leaderboard.setCount(row.ID, row.NAME, Number(row.COMPLAINT_COUNT));
    });

    console.log('Leaderboard rebuilt from DB');
  } catch (err) {
    console.error('Error rebuilding leaderboard:', err);
  }
};

export const addComplaint = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await withConnection((conn) =>
      conn.execute(
        `SELECT RAWTOHEX(id) AS id, name FROM users WHERE id = HEXTORAW(:userId)`,
        { userId }
      )
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const user = result.rows[0];
    leaderboard.addComplaint(user.ID, user.NAME);

    res.json({ message: 'Complaint added', top: leaderboard.topN(10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLeaderboard = (req, res) => {
  res.json({ top: leaderboard.topN(10) });
};