
import Complaint from '../models/Complaint.js';
import { complaintsList } from '../services/dllComplaints.js';
import { leaderboard } from './leaderboard.controller.js';

import User from '../models/User.js';


export const getAllComplaintsStatus = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email mobile joinedDate')
      .sort({ createdAt: -1 });

    const formatted = complaints.map(c => ({
      id: c._id.toString(),
      title: c.title,
      description: c.description,
      location: c.location,
      status: c.status,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      user: c.user
        ? {
            name: c.user.name,
            email: c.user.email,
            mobile: c.user.mobile,
            joinedDate: c.user.joinedDate ? new Date(c.user.joinedDate).toLocaleDateString() : "N/A"
          }
        : null 
    }));

    console.log(formatted);
    res.json({ complaints: formatted });
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const submitComplaint = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    // if (!title || !description) {
    //   return res.status(400).json({ message: 'Required fields missing' });
    // }

    // Save complaintin MongoDB
    const complaint = new Complaint({
      user: req.user._id, 
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

    leaderboard.addComplaint(req.user.email, req.user.name);

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

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    complaint.updatedAt = new Date();
    await complaint.save();

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
    const complaints = await Complaint.find({ user: req.user._id }).populate('user', 'name email mobile joinDate');
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
