// controllers/report.controller.js
import Complaint from '../models/Complaint.js';
import { complaintsList } from '../services/dllComplaints.js';
import { leaderboard } from './leaderboard.controller.js';
import { undoStack, redoStack } from '../services/stackStatus.js'; // optional undo/redo stacks

// Submit a new complaint
export const submitComplaint = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Save complaint permanently in MongoDB
    const complaint = new Complaint({
      user: req.user._id, // from authMiddleware
      title,
      description,
      location
    });

    await complaint.save();

    const id = complaint._id.toString();

    // Add to DLL for fast access / timeline
    complaintsList.addComplaint({
      id,
      fullName: req.user.name,
      email: req.user.email,
      phone: req.user.mobile,
      location,
      complaintDetails: description,
      status: complaint.status,
      createdAt: complaint.createdAt
    });

    // Update leaderboard BST
    leaderboard.addComplaint(req.user.email, {
      name: req.user.name,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });

    res.status(201).json({ message: 'Complaint submitted', complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update complaint status (admin only)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) return res.status(400).json({ message: 'Missing fields' });

    // Fetch complaint from MongoDB
    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const oldStatus = complaint.status;

    // Update status in MongoDB
    complaint.status = status;
    complaint.updatedAt = new Date();
    await complaint.save();

    // Update status in DLL
    complaintsList.updateStatus(id, status);

    // Update leaderboard status counts
    leaderboard.updateComplaintStatus(req.user.email, status, oldStatus);

    // Push to undo stack for admin (optional)
    undoStack.push({ id, oldStatus, newStatus: status });

    res.json({ message: 'Status updated', complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all complaints (for admin)
export const getAllComplaintsForAdmin = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'name email mobile');
    res.json({ complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get logged-in user's complaints
export const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id });
    res.json({ complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Undo last status change (admin)
export const undoStatus = async (req, res) => {
  try {
    if (undoStack.isEmpty()) return res.status(400).json({ message: 'Nothing to undo' });

    const { id, oldStatus, newStatus } = undoStack.pop();

    // Update MongoDB
    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    complaint.status = oldStatus;
    complaint.updatedAt = new Date();
    await complaint.save();

    // Update DLL
    complaintsList.updateStatus(id, oldStatus);

    // Update leaderboard
    leaderboard.updateComplaintStatus(req.user.email, oldStatus, newStatus);

    // Push to redo stack
    redoStack.push({ id, oldStatus: newStatus, newStatus: oldStatus });

    res.json({ message: 'Undo successful', complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Redo last undone status change (admin)
export const redoStatus = async (req, res) => {
  try {
    if (redoStack.isEmpty()) return res.status(400).json({ message: 'Nothing to redo' });

    const { id, oldStatus, newStatus } = redoStack.pop();

    // Update MongoDB
    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    complaint.status = newStatus;
    complaint.updatedAt = new Date();
    await complaint.save();

    // Update DLL
    complaintsList.updateStatus(id, newStatus);

    // Update leaderboard
    leaderboard.updateComplaintStatus(req.user.email, newStatus, oldStatus);

    // Push back to undo stack
    undoStack.push({ id, oldStatus, newStatus });

    res.json({ message: 'Redo successful', complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
