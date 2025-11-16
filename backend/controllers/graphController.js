import { cityGraph } from '../services/graphComplaints.js';

// Add a complaint to a specific area
export const addComplaintToArea = (req, res) => {
  const { area, complaint } = req.body;

  if (!area || !complaint) {
    return res.status(400).json({ message: 'Area and complaint required' });
  }

  cityGraph.addComplaint(area, complaint);
  res.status(201).json({ message: `Complaint added to ${area}` });
};

// Get cluster using BFS
export const getClusterBFS = (req, res) => {
  const { startArea } = req.params;
  if (!startArea) return res.status(400).json({ message: 'Start area required' });

  const cluster = cityGraph.getClusterBFS(startArea);
  res.status(200).json({ cluster });
};

// Get cluster using DFS
export const getClusterDFS = (req, res) => {
  const { startArea } = req.params;
  if (!startArea) return res.status(400).json({ message: 'Start area required' });

  const cluster = cityGraph.getClusterDFS(startArea);
  res.status(200).json({ cluster });
};
