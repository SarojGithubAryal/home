const roomService = require('./RoomService');
const greetingService = require('./GreetingService');
const themeService = require('./ThemeService');
const recommendationService = require('./RecommendationService');
const moodService = require('./MoodService');
const roomPageService = require('./RoomPageService');
const greetingEngine = require('../engines/GreetingEngine');
const themeEngine = require('../engines/ThemeEngine');
const recommendationEngine = require('../engines/RecommendationEngine');
const experienceEngine = require('../engines/ExperienceEngine');

class RoomExperienceService {
  async build(roomSlug, context = {}) {
    const room = await roomService.getRoomWithContents(roomSlug);
    if (!room) return null;

    const mood = context.moodSlug ? await moodService.getMoodBySlug(context.moodSlug) : null;

    const greetingCandidates = await greetingService.getMatchingGreetings({
      timeOfDay: context.timeOfDay,
      moodId: mood?.id,
    });
    const greeting = greetingEngine.select({
      candidates: greetingCandidates,
      context: { timeOfDay: context.timeOfDay },
    });

    const roomThemes = await themeService.getThemesByRoom(room.id);
    const allThemes = await themeService.getAllThemes();
    const theme = themeEngine.determine({
      room,
      weather: context.weatherCondition ? { condition: context.weatherCondition } : null,
      season: context.season,
      timeOfDay: context.timeOfDay,
      mood,
      themes: roomThemes.length ? roomThemes : allThemes,
    });

    const rules = await recommendationService.getAllRules();
    const contents = room.contents || [];
    const recommendation = recommendationEngine.select({
      rules,
      contents,
      context: {
        moodId: mood?.id,
        timeOfDay: context.timeOfDay,
        weatherCondition: context.weatherCondition,
        season: context.season,
      },
    });

    const pageData = await roomPageService.getPageData(room.id);

    return experienceEngine.assembleRoom({
      room,
      theme,
      greeting,
      recommendation,
      contents,
      roomConfig: pageData.config,
      sections: pageData.sections,
    });
  }
}

module.exports = new RoomExperienceService();