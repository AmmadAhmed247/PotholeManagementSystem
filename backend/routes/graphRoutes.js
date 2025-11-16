import express from 'express';
import { addComplaintToArea, getClusterBFS, getClusterDFS } from '../controllers/graphController.js';

const router = express.Router();

// Add complaint to an area
router.post('/add', addComplaintToArea);

// Get cluster starting from an area (BFS)
router.get('/bfs/:startArea', getClusterBFS);

// Get cluster starting from an area (DFS)
router.get('/dfs/:startArea', getClusterDFS);

export default router;
