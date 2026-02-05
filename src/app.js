// ================== IMPORT ==================
const express = require('express');
const dotenv = require('dotenv');

// Load env (HARUS PALING ATAS)
dotenv.config();

// Database
const connectDB = require('./config/db');

// Routes
const financeRoutes = require('./routes/financeRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

// ================== INIT APP ==================
const app = express();

// ================== MIDDLEWARE ==================
app.use(express.json());

// ================== ROUTES ==================
app.use('/api/finances', financeRoutes);
app.use('/api/reminders', reminderRoutes);

// ================== SERVER ==================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

// ================== DB ==================
connectDB();
