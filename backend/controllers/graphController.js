import Complaint from '../models/Complaint.js';
import { cityGraph } from '../services/graphComplaints.js';

// Add complaint
export const addComplaintToArea = async (req, res) => {
  const { area, title, description, userId } = req.body;

  if (!area || !title || !description || !userId)
    return res.status(400).json({ message: 'All fields required' });

  // Save complaint in DB
  const complaint = new Complaint({
    user: userId,
    title,
    description,
    area
  });
  await complaint.save();

  // Add to in-memory graph
  cityGraph.addComplaint(area, complaint);

  res.status(201).json({ message: 'Complaint added', complaint });
};
