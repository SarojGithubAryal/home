const moodModel = require('../models/moodModel');

const fetchAllMoods = async () => {
    const moods = await moodModel.getAllMoods();
    return {
        success: true,
        data: moods,
        message: moods.length === 0 ? 'No moods available yet' : undefined,
    };
};

const fetchMoodById = async (id) => {
    const mood = await moodModel.getMoodById(id);
    if (!mood) {
        return { success: false, message: 'Mood not found' };
    }
    return { success: true, data: mood };
};

module.exports = { fetchAllMoods, fetchMoodById };