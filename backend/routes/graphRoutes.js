// routes/graphRoutes.js
import express from 'express';
import Complaint from '../models/Complaint.js';
import { cityGraph } from '../services/graphComplaints.js';

const router = express.Router();

// Add complaint to area and DB
router.post('/graph/add', async (req, res) => {
  try {
    const { area, title, description, userEmail } = req.body;

    if (!area || !title || !description || !userEmail) {
      return res.status(400).json({ message: 'Area, title, description, and userEmail required' });
    }

    // Save complaint to DB
    const complaint = await Complaint.create({
      user: userEmail, // or userId if you store ObjectId
      title,
      description,
      location: area,
      status: 'Pending'
    });

    // Add complaint to graph
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
