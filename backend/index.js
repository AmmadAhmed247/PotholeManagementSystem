const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const auth = require('./routes/auth');

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api/auth',auth);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB is Connected'))
    .catch(err => console.log('DB connect nhi ho rha',err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
