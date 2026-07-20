const recommendationRepository = require('../repositories/RecommendationRepository');

class RecommendationService {
  /**
   * Retrieve all active recommendation rules, ordered by priority.
   * @returns {Promise<Array>}
   */
  async getAllRules() {
    return recommendationRepository.findAllActive();
  }

  /**
   * Retrieve recommendation rules matching a given context.
   * The caller (future Recommendation Engine) will pick the best one.
   * @param {Object} context - { moodId, contentTypeId, timeOfDay, weatherCondition, season }
   * @returns {Promise<Array>}
   */
  async getMatchingRules(context = {}) {
    return recommendationRepository.findMatching(context);
  }
}

module.exports = new RecommendationService();