import express from 'express';
import { submitComplaint, updateComplaintStatus, getAllComplaintsStatus, getAllComplaintsForAdmin, getUserComplaints } from '../controllers/report.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/complaint', authMiddleware, submitComplaint);
router.put('/complaint/status', authMiddleware, updateComplaintStatus); // update status
router.get('/complaints/status', authMiddleware, getAllComplaintsStatus); // get all complaints with status
router.get('/complaints/admin', authMiddleware, getAllComplaintsForAdmin);
router.get('/complaints/user', authMiddleware, getUserComplaints);

export default router;
