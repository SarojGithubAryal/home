const pool = require('../config/database');

const getAllMoods = async () => {
    const query = 'SELECT id, name, emoji, description, created_at FROM moods ORDER BY created_at ASC';
    const result = await pool.query(query);
    return result.rows;
};

const getMoodById = async (id) => {
    const query = 'SELECT id, name, emoji, description, created_at FROM moods WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};

module.exports = { getAllMoods, getMoodById };