// report.controller.js
import {complaintsList} from "../services/dllComplaints.js"
import { leaderboard } from './leaderboard.controller.js';
const complaintsMap = new Map(); 

export const submitComplaint = (req, res) => {
  const { fullName, email, phone, location, complaintDetails, cnic, chairman } = req.body;

  if (!fullName || !email || !phone || !location || !complaintDetails) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  const id = complaintsMap.size + 1;
  const complaint = {
    id,
    fullName,
    email,
    phone,
    location,
    complaintDetails,
    cnic: cnic || null,
    chairman: chairman || null,
    status: 'Pending',
    createdAt: new Date()
  };
  complaintsMap.set(id, complaint);
  complaintsList.addComplaint({ ...complaint });
  leaderboard.addComplaint(email, {
    name: fullName,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  });

  res.status(201).json({ message: 'Complaint submitted', complaint });
};

// Update status
export const updateComplaintStatus = (req, res) => {
  const { id, status } = req.body;
  if (!id || !status) return res.status(400).json({ message: 'Missing fields' });

  // Get the complaint to find user and old status
  const complaintNode = complaintsList.map.get(id);
  if (!complaintNode) return res.status(404).json({ message: 'Complaint not found' });
  
  const oldStatus = complaintNode.complaint.status;
  const userEmail = complaintNode.complaint.email;

  // Update status in DLL
  const success = complaintsList.updateStatus(id, status);
  if (!success) return res.status(404).json({ message: 'Complaint not found' });

  // ✅ Update leaderboard status counts
  leaderboard.updateComplaintStatus(userEmail, status, oldStatus);

  res.json({ message: 'Status updated', complaint: complaintsList.map.get(id).complaint });
};

// Get all complaints from DLL
export const getAllComplaintsStatus = (req, res) => {
  res.json({ complaints: complaintsList.getAllComplaints() });
};

export const getAllComplaintsForAdmin = (req, res) => {
  res.json({ complaints: complaintsList.getAllComplaints() });
};

export const getUserComplaints = (req, res) => {
  const { email } = req.query;
  const userComplaints = Array.from(complaintsMap.values()).filter(c => c.email === email);
  res.json({ complaints: userComplaints });
};