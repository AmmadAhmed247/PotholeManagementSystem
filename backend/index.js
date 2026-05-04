import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/auth.route.js';
import ComplaintRouter from './routes/complaint.route.js';
import LeaderboardRouter from './routes/leaderboard.route.js';
import graphRoutes from './routes/graphRoutes.js';
import { connectDb } from './services/Db.js';
import { rebuildLeaderboard } from './controllers/leaderboard.controller.js';
import { cityGraph } from './services/graphComplaints.js';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api', ComplaintRouter);
app.use('/api', LeaderboardRouter);
app.use('/api/graph', graphRoutes);

const PORT = process.env.PORT || 5000;

connectDb().then(() => {
  rebuildLeaderboard().catch((err) => console.error('Error rebuilding leaderboard:', err));
  cityGraph.rebuildGraphFromDB().catch((err) => console.error('Error rebuilding graph:', err));
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});