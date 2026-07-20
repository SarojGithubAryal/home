const moodRepository = require('../repositories/MoodRepository');

class MoodService {
  /**
   * Get all active moods, enriched with title/label/subtitle.
   */
  async getAllMoods() {
    const moods = await moodRepository.findAllActive();
    return moods.map(mood => ({
      ...mood,
      title: mood.name,
      label: mood.name,
      subtitle: mood.subtitle || null,
    }));
  }

  /**
   * Get a single mood by its slug.
   */
  async getMoodBySlug(slug) {
    const mood = await moodRepository.findBySlug(slug);
    if (!mood) return null;
    return {
      ...mood,
      title: mood.name,
      label: mood.name,
      subtitle: mood.subtitle || null,
    };
  }

  /**
   * Get a single mood by its UUID, enriched same way.
   */
  async getMoodById(id) {
    const mood = await moodRepository.findById(id);
    if (!mood) return null;
    return {
      ...mood,
      title: mood.name,
      label: mood.name,
      subtitle: mood.subtitle || null,
    };
  }
}

module.exports = new MoodService();