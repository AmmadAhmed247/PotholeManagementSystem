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
