const roomExperienceService = require('../services/RoomExperienceService');
const { sendSuccess, sendError } = require('../middleware/responseHelper');

class RoomExperienceController {
  /**
   * Handles GET /api/rooms/:roomSlug/hear|read|see|memory
   */
  async getExperience(req, res, next) {
    try {
      const { roomSlug, experienceType } = req.params;
      const { tabId, search, page, limit } = req.query;

      const experience = await roomExperienceService.build(roomSlug, experienceType, {
        tabId,
        search,
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 20,
      });

      if (!experience) {
        return sendError(res, 404, 'NOT_FOUND', 'Experience not available.');
      }

      sendSuccess(res, experience, null);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RoomExperienceController();