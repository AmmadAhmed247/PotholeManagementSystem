import express from 'express';
import { fileComplaint,  getUserComplaints } from '../controllers/complaintController.js';


const router = express.Router();

router.post('/file', fileComplaint); // protected route
router.get('/mycomplaints', getUserComplaints); // protected route

export default router;
