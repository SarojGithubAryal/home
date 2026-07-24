const moodService = require('./MoodService');
const greetingService = require('./GreetingService');
const themeService = require('./ThemeService');
const moodLandingContentService = require('./MoodLandingContentService');
const greetingEngine = require('../engines/GreetingEngine');
const themeEngine = require('../engines/ThemeEngine');
const experienceEngine = require('../engines/ExperienceEngine');
const getTimeContext = require('../utils/timeContext');

class MoodExperienceService {
  /**
   * Build the Mood Landing experience for a given mood slug.
   */
  async buildLanding(moodSlug, context = {}) {
    const mood = await moodService.getMoodBySlug(moodSlug);
    if (!mood) return null;

    // Fetch dedicated landing content
    const landingData = await moodLandingContentService.getLandingData(mood.id, context.language || 'en');

    // If no content exists yet, provide a minimal fallback (shouldn't happen after seeding)
    const landingContent = landingData?.content || null;
    const rooms = landingData?.rooms || [];

    // Greeting
    const timeCtx = getTimeContext();
    const greetingCandidates = await greetingService.getMatchingGreetings({
      timeOfDay: timeCtx.timeOfDay,
      moodId: mood.id,
    });
    const greeting = greetingEngine.select({
      candidates: greetingCandidates,
      context: { timeOfDay: timeCtx.timeOfDay },
    });

    // Theme
    const themes = await themeService.getAllThemes();
    const theme = themeEngine.determine({
      mood,
      themes,
    });
    theme.timeVariant = timeCtx.timeVariant;

    return experienceEngine.assembleMoodLanding({
      mood,
      greeting,
      theme,
      landingContent,
      rooms,
    });
  }
}

module.exports = new MoodExperienceService();