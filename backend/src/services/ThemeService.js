const themeRepository = require('../repositories/ThemeRepository');

class ThemeService {
  /**
   * Get all active themes.
   * @returns {Promise<Array>}
   */
  async getAllThemes() {
    return themeRepository.findAllActive();
  }

  /**
   * Get a theme by its slug.
   * @param {string} slug
   * @returns {Promise<Object|null>}
   */
  async getThemeBySlug(slug) {
    return themeRepository.findBySlug(slug);
  }

  /**
   * Get themes associated with a specific room.
   * @param {string} roomId
   * @returns {Promise<Array>}
   */
  async getThemesByRoom(roomId) {
    return themeRepository.findByRoomId(roomId);
  }
}

module.exports = new ThemeService();