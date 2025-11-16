import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route.js';
import { connectDb } from './services/Db.js';
import Complaint from "./routes/complaint.route.js";
import Leaderboard from "./routes/leaderboard.route.js";
import graphRoutes from './routes/graphRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRouter);
//routes
app.use('/api', Complaint);
app.use('/api', Leaderboard);
app.use('/api/graph', graphRoutes);

const PORT = process.env.PORT || 5000;

connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
