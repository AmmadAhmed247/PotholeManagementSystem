import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route.js';
import { connectDb } from './services/Db.js';
import Complaint from "./routes/complaint.route.js";
import Leaderboard from "./routes/leaderboard.route.js";
import graphRoutes from './routes/graphRoutes.js';
import cors from 'cors';
import { rebuildLeaderboard } from './controllers/leaderboard.controller.js';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api', Complaint);
app.use('/api', Leaderboard);
app.use('/api/graph', graphRoutes);

const PORT = process.env.PORT || 5000;

connectDb().then(() => {
  console.log('Database connected');

  // Rebuild leaderboard from DB
  rebuildLeaderboard().catch(err => console.error('Error rebuilding leaderboard:', err));

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
