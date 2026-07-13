require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const moodRoutes = require('./src/routes/moodRoutes');
app.use('/api/moods', moodRoutes);

// Health endpoint
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            status: 'Home backend running',
            environment: process.env.APP_ENV || 'development',
            dbTime: result.rows[0].now,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});