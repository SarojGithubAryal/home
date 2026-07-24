const statisticsRepository = require('../repositories/StatisticsRepository');
const definitionsRepository = require('../repositories/StatisticsDefinitionRepository'); // created below

class StatisticsService {
  /**
   * Get an ordered array of stat objects for a room and experience type.
   */
  async getStats(roomId, experienceType, contentTypeSlugs) {
    const definitions = await definitionsRepository.findActiveByExperience(experienceType);
    if (!definitions.length) return [];

    const raw = await statisticsRepository.computeStats(roomId, contentTypeSlugs);

    return definitions.map(def => {
      let rawValue = null;
      let value = '';
      let rawSeconds = null;

      switch (def.calculation_type) {
        case 'count':
          rawValue = raw.total_items || 0;
          value = String(rawValue);
          break;
        case 'duration': {
          const totalSec = raw.total_duration_seconds || 0;
          rawSeconds = totalSec;
          const hours = Math.floor(totalSec / 3600);
          const minutes = Math.floor((totalSec % 3600) / 60);
          value = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
          break;
        }
        case 'oldest_date':
          value = raw.oldest_date ? raw.oldest_date.toISOString() : null;
          rawValue = raw.oldest_date ? raw.oldest_date.getTime() : null;
          break;
        case 'newest_date':
          value = raw.newest_date ? raw.newest_date.toISOString() : null;
          rawValue = raw.newest_date ? raw.newest_date.getTime() : null;
          break;
        default:
          value = null;
      }

      return {
        id: def.stat_id,
        iconKey: def.icon_key,
        label: def.label,
        group: def.display_group || null,
        value,
        ...(rawValue !== null && { rawValue }),
        ...(rawSeconds !== null && { rawSeconds }),
      };
    });
  }
}

module.exports = new StatisticsService();