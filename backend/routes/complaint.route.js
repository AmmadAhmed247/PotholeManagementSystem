// complaintRoutes.js
import express from 'express';
import {
  submitComplaint,
  updateComplaintStatus,
  getAllComplaintsStatus,
  getAllComplaintsForAdmin,
    getUserComplaints
} from '../controllers/report.controller.js';

const router = express.Router();

router.post('/complaint', submitComplaint); // existing submission
router.put('/complaint/status', updateComplaintStatus); // update status
router.get('/complaints/status', getAllComplaintsStatus); // get ordered complaints for admin
router.get('/complaints/admin', getAllComplaintsForAdmin);
router.get('/complaints/user', getUserComplaints);

export default router;
