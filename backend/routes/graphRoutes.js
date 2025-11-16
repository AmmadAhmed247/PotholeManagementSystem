// Add these routes to your complaintRoutes.js or create graphRoutes.js

import express from 'express';
import { cityGraph, complaintsList } from '../services/graphComplaints.js';

const router = express.Router();

// Add complaint to graph
router.post('/graph/add', (req, res) => {
  try {
    const { area, complaint } = req.body;
    
    // Add to graph
    cityGraph.addComplaint(area, complaint);
    
    // Add to DLL
    complaintsList.addComplaint(complaint);
    
    res.status(201).json({ message: 'Complaint added to graph', area });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get cluster using BFS
router.get('/graph/bfs/:startArea', (req, res) => {
  try {
    const { startArea } = req.params;
    const cluster = cityGraph.getClusterBFS(startArea);
    
    res.status(200).json({ 
      cluster, 
      totalComplaints: cluster.length 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get cluster using DFS
router.get('/graph/dfs/:startArea', (req, res) => {
  try {
    const { startArea } = req.params;
    const cluster = cityGraph.getClusterDFS(startArea);
    
    res.status(200).json({ 
      cluster, 
      totalComplaints: cluster.length 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Undo status change
router.post('/complaint/undo', (req, res) => {
  try {
    const success = complaintsList.undo();
    if (success) {
      res.status(200).json({ message: 'Undo successful' });
    } else {
      res.status(400).json({ message: 'Nothing to undo' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Redo status change
router.post('/complaint/redo', (req, res) => {
  try {
    const success = complaintsList.redo();
    if (success) {
      res.status(200).json({ message: 'Redo successful' });
    } else {
      res.status(400).json({ message: 'Nothing to redo' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;