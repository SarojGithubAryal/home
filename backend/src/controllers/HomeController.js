const homeExperienceService = require('../services/HomeExperienceService');
const { sendSuccess, sendError } = require('../middleware/responseHelper');

class HomeController {
  async getHome(req, res, next) {
    try {
      const hour = new Date().getHours();
      let timeOfDay;
      if (hour < 12) timeOfDay = 'morning';
      else if (hour < 17) timeOfDay = 'afternoon';
      else if (hour < 21) timeOfDay = 'evening';
      else timeOfDay = 'night';

      const context = {
        timeOfDay,
        weatherCondition: req.query.weatherCondition || null,
        season: req.query.season || null,
        moodSlug: req.query.moodSlug || null,
      };

      const experience = await homeExperienceService.build(context);
      // GET home never navigates
      sendSuccess(res, experience, null);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new HomeController();