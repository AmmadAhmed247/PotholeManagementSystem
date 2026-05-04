import oracledb from 'oracledb';
import express from 'express';
import { withConnection } from '../services/Db.js';
import { cityGraph } from '../services/graphComplaints.js';

const router = express.Router();

// Add complaint to area and DB
router.post('/graph/add', async (req, res) => {
  try {
    const { area, title, description, userEmail } = req.body;

    if (!area || !title || !description || !userEmail)
      return res.status(400).json({ message: 'Area, title, description, and userEmail required' });

    // Look up user id from email
    const userResult = await withConnection((conn) =>
      conn.execute(
        `SELECT RAWTOHEX(id) AS id FROM users WHERE email = :email`,
        { email: userEmail }
      )
    );

    if (userResult.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const userId = userResult.rows[0].ID;

    const result = await withConnection((conn) =>
      conn.execute(
        `INSERT INTO complaints (user_id, title, description, location, area, status)
         VALUES (HEXTORAW(:userId), :title, :description, :area, :area, 'Pending')
         RETURNING RAWTOHEX(id) INTO :id`,
        {
          userId,
          title,
          description,
          area,
          id: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        },
        { autoCommit: true }
      )
    );

    const complaint = { id: result.outBinds.id[0], userId, title, description, area, status: 'Pending' };

    cityGraph.addComplaint(area, complaint);

    res.status(201).json({ message: 'Complaint added to graph', complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get cluster using BFS
router.get('/graph/bfs/:startArea', (req, res) => {
  const { startArea } = req.params;
  if (!startArea) return res.status(400).json({ message: 'Start area required' });

  const cluster = cityGraph.getClusterBFS(startArea);
  res.status(200).json({ cluster, totalComplaints: cluster.reduce((sum, c) => sum + c.complaints.length, 0) });
});

// Get cluster using DFS
router.get('/graph/dfs/:startArea', (req, res) => {
  const { startArea } = req.params;
  if (!startArea) return res.status(400).json({ message: 'Start area required' });

  const cluster = cityGraph.getClusterDFS(startArea);
  res.status(200).json({ cluster, totalComplaints: cluster.reduce((sum, c) => sum + c.complaints.length, 0) });
});

export default router;