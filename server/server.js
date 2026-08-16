
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
const connectDB = require('./config/db');


// Route imports
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const examRoutes = require('./routes/examRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/submissions', submissionRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Online Exam API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});