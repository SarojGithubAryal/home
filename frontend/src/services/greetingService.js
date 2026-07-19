const greetingRepository = require('../repositories/GreetingRepository');

class GreetingService {
  /**
   * Retrieve all active greetings matching a given context.
   * The caller (future Engine) will decide which greeting to use.
   * @param {Object} context - { timeOfDay, weatherCondition, season, moodId, language }
   * @returns {Promise<Array>}
   */
  async getMatchingGreetings(context = {}) {
    return greetingRepository.findMatching(context);
  }
}

module.exports = new GreetingService();