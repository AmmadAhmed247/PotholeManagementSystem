// controllers/complaintController.js
import Complaint from '../models/Complaint.js';

export const fileComplaint = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    // req.user comes from authMiddleware
    const complaint = new Complaint({
      user: req.user._id,
      title,
      description,
      location
    });

    await complaint.save();

    res.status(201).json({ message: 'Complaint filed successfully', complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getUserComplaints = async (req, res) => {
  try {
    // req.user comes from authMiddleware
    const userId = req.user._id;

    // Find all complaints by this user
    const complaints = await Complaint.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({ complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

