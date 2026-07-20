/**
 * RecommendationEngine
 *
 * Chooses the best recommendation from candidate rules and content,
 * and selects a room to display as the recommended entry point.
 */

class RecommendationEngine {

  /**
   * Select the most appropriate content recommendation.
   * (unchanged logic)
   */
  select({ rules = [], contents = [], context = {} } = {}) {
    if (!rules.length || !contents.length) return null;

    const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

    for (const rule of sortedRules) {
      if (this._matchesContext(rule, context)) {
        const match = this._findContent(rule, contents);
        if (match) {
          return {
            recommendation: match,
            rule: { id: rule.id, name: rule.name },
          };
        }
      }
    }

    return null;
  }

  /**
   * Select the recommended room.
   * Currently returns the first room in the list (future logic may
   * factor in mood, time, etc.).
   *
   * @param {Array} rooms – active rooms from the repository
   * @param {Object} [context] – future extension
   * @returns {Object|null}
   */
  selectRoom({ rooms = [], context = {} } = {}) {
    if (!rooms.length) return null;
    // For now, simply return the first room (display order is already applied)
    return rooms[0];
  }

  _matchesContext(rule, context) {
    if (context.moodId && rule.mood_id && rule.mood_id !== context.moodId) return false;
    if (context.timeOfDay && rule.time_of_day && rule.time_of_day !== 'any' && rule.time_of_day !== context.timeOfDay) return false;
    if (context.weatherCondition && rule.weather_condition && rule.weather_condition !== context.weatherCondition) return false;
    if (context.season && rule.season && rule.season !== 'any' && rule.season !== context.season) return false;
    return true;
  }

  _findContent(rule, contents) {
    if (rule.content_type_id) {
      return contents.find(c => c.content_type_id === rule.content_type_id) || null;
    }
    return contents[0] || null;
  }
}

module.exports = new RecommendationEngine();