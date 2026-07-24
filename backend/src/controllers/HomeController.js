const homeExperienceService = require('../services/HomeExperienceService');
const { sendSuccess, sendError } = require('../middleware/responseHelper');

class HomeController {
  async getHome(req, res, next) {
    try {
      const context = {
        weatherCondition: req.query.weatherCondition || null,
        season: req.query.season || null,
        moodSlug: req.query.moodSlug || null,
      };

      const experience = await homeExperienceService.build(context);
      sendSuccess(res, experience, null);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new HomeController();