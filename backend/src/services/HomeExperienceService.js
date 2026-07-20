const homeService = require('./HomeService');
const greetingService = require('./GreetingService');
const themeService = require('./ThemeService');
const recommendationService = require('./RecommendationService');
const moodService = require('./MoodService');
const pool = require('../config/database');   // only to read home_config

const experienceEngine = require('../engines/ExperienceEngine');
const greetingEngine = require('../engines/GreetingEngine');
const themeEngine = require('../engines/ThemeEngine');
const recommendationEngine = require('../engines/RecommendationEngine');

class HomeExperienceService {
  /**
   * Assemble a complete Home experience.
   * @param {Object} context - { timeOfDay, weatherCondition, season, moodSlug? }
   * @returns {Promise<Object>} complete Home experience
   */
  async build(context = {}) {
    // 1. Get rooms
    const rooms = await homeService.getActiveRooms();

    // 2. Get mood (if selected)
    let mood = null;
    if (context.moodSlug) {
      mood = await moodService.getMoodBySlug(context.moodSlug);
    }

    // 3. Greeting candidates
    const greetingCandidates = await greetingService.getMatchingGreetings({
      timeOfDay: context.timeOfDay,
      weatherCondition: context.weatherCondition,
      season: context.season,
      moodId: mood?.id,
    });

    // 4. Choose greeting
    const greeting = greetingEngine.select({
      candidates: greetingCandidates,
      context: {
        timeOfDay: context.timeOfDay,
        weatherCondition: context.weatherCondition,
        season: context.season,
        moodId: mood?.id,
      },
    });

    // 5. Theme
    const themes = await themeService.getAllThemes();
    const theme = themeEngine.determine({
      weather: context.weatherCondition ? { condition: context.weatherCondition } : null,
      season: context.season,
      timeOfDay: context.timeOfDay,
      mood,
      themes,
    });

    // 6. Content recommendation (will be null, no content yet)
    const rules = await recommendationService.getAllRules();
    const recommendation = recommendationEngine.select({
      rules,
      contents: [],
      context: {
        moodId: mood?.id,
        timeOfDay: context.timeOfDay,
        weatherCondition: context.weatherCondition,
        season: context.season,
      },
    });

    // 7. Daily message
    const dailyMessage = await homeService.getTodayMessage();

    // 8. Recommended room (using the engine's new method)
    const recommendedRoom = recommendationEngine.selectRoom({
      rooms,
      context: { moodId: mood?.id },
    });

    // 9. Home page configuration (hero subtitle, footer)
    const homeConfig = await this._getHomeConfig();

    // 10. Assemble experience
    return experienceEngine.assembleHome({
      greeting,
      theme,
      recommendation,
      rooms,
      dailyMessage,
      recommendedRoom,
      homeConfig,
    });
  }

  /**
   * Read the single home_config row.
   * @returns {Object|null}
   */
  async _getHomeConfig() {
    try {
      const result = await pool.query('SELECT hero_subtitle, footer_text, footer_icon FROM home_config WHERE id = TRUE');
      const row = result.rows[0];
      if (!row) return null;
      return {
        heroSubtitle: row.hero_subtitle,
        footerText: row.footer_text,
        footerIcon: row.footer_icon,
      };
    } catch (err) {
      // If table doesn't exist (very early run before migration), fail silently
      return null;
    }
  }
}

module.exports = new HomeExperienceService();