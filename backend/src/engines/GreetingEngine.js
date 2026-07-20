/**
 * GreetingEngine
 *
 * Selects the most appropriate greeting from a set of candidates
 * based on the current context. No database access.
 */

class GreetingEngine {

  /**
   * Choose a greeting based on context.
   * @param {Object} params
   * @param {Array}  params.candidates - greeting objects from the service
   * @param {Object} [params.context]  - { timeOfDay, weatherCondition, season, moodId, language }
   * @returns {Object|null} the chosen greeting object, or null
   */
  select({ candidates = [], context = {} } = {}) {
    if (!candidates.length) return null;

    const { timeOfDay, weatherCondition, season, moodId } = context;

    // Scoring system: each match adds points
    const scored = candidates.map(greeting => {
      let score = 0;
      if (greeting.time_of_day === timeOfDay) score += 3;
      else if (greeting.time_of_day === 'any') score += 1;

      if (greeting.weather_condition === weatherCondition) score += 3;
      else if (!greeting.weather_condition) score += 1;

      if (greeting.season === season) score += 2;
      else if (greeting.season === 'any') score += 1;

      if (greeting.mood_id === moodId) score += 2;
      else if (!greeting.mood_id) score += 1;

      return { ...greeting, _score: score };
    });

    // Sort by score descending, pick the top
    scored.sort((a, b) => b._score - a._score);
    return scored[0] || null;
  }
}

module.exports = new GreetingEngine();