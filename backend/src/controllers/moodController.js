const moodService = require('../services/moodService');

const getAllMoods = async (req, res) => {
    try {
        const result = await moodService.fetchAllMoods();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching moods:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getMoodById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await moodService.fetchMoodById(id);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error fetching mood:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { getAllMoods, getMoodById };