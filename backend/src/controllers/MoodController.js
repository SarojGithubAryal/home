const moodService = require('../services/MoodService');
const experienceNavigationService = require('../services/ExperienceNavigationService');
const { sendSuccess, sendError } = require('../middleware/responseHelper');
const moodExperienceService = require('../services/MoodExperienceService');

class MoodController {
  /**
   * GET /api/moods
   */
  async getMoods(req, res, next) {
    try {
      const moods = await moodService.getAllMoods();
      sendSuccess(res, moods, null);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/moods/select
   * Frontend sends { moodId } — backend resolves slug internally.
   */
  async selectMood(req, res, next) {
    try {
      const { moodId } = req.body;

      if (!moodId) {
        return sendError(res, 400, 'INVALID_REQUEST', 'moodId is required.');
      }

      const mood = await moodService.getMoodById(moodId);
      if (!mood) {
        return sendError(res, 404, 'NOT_FOUND', 'Mood not found.');
      }

      const destination = experienceNavigationService.selectMood(mood.slug);

      sendSuccess(
        res,
        { selectedMood: mood.slug },
        destination
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/moods/:moodSlug
   * Official resource endpoint – returns the complete Mood Landing experience.
   */
  async getMood(req, res, next) {
    try {
      const { moodSlug } = req.params;
      const context = {
        weatherCondition: req.query.weatherCondition || null,
        season: req.query.season || null,
      };

      const experience = await moodExperienceService.buildLanding(moodSlug, context);
      if (!experience) {
        return sendError(res, 404, 'NOT_FOUND', `Mood '${moodSlug}' not found.`);
      }

      sendSuccess(res, experience, null);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MoodController();