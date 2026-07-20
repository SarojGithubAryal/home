const moodLandingContentRepository = require('../repositories/MoodLandingContentRepository');

class MoodLandingContentService {
  /**
   * Get the landing content and associated destinations for a given mood.
   * @param {string} moodId
   * @param {string} language
   * @returns {Promise<{ content: object|null, destinations: array }>}
   */
  async getLandingData(moodId, language = 'en') {
    const content = await moodLandingContentRepository.findContentByMoodId(moodId, language);
    if (!content) {
      return { content: null, destinations: [] };
    }
    const rooms = await moodLandingContentRepository.findRoomEntriesByContentId(content.id);
    return { content, rooms };
  }
}

module.exports = new MoodLandingContentService();