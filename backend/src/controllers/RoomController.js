const roomPageExperienceService = require('../services/RoomPageExperienceService');
const roomService = require('../services/RoomService');
const experienceNavigationService = require('../services/ExperienceNavigationService');
const { sendSuccess, sendError } = require('../middleware/responseHelper');

class RoomController {
  /**
   * GET /api/rooms/:roomSlug
   * Read-only room experience — no navigation change.
   */
  async getRoom(req, res, next) {
    try {
      const { roomSlug } = req.params;
      const context = {
        weatherCondition: req.query.weatherCondition || null,
        season: req.query.season || null,
        moodSlug: req.query.moodSlug || null,
      };

      const experience = await roomPageExperienceService.build(roomSlug, context);

      if (!experience) {
        return sendError(res, 404, 'NOT_FOUND', `Room '${roomSlug}' not found.`);
      }

      sendSuccess(res, experience, null);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/rooms/enter
   * Action that changes the user experience — returns navigation.
   */
  async enterRoom(req, res, next) {
    try {
      const { roomSlug } = req.body;
      if (!roomSlug) {
        return sendError(res, 400, 'INVALID_REQUEST', 'roomSlug is required.');
      }

      // Validate room exists
      const room = await roomService.getRoomWithContents(roomSlug);
      if (!room) {
        return sendError(res, 404, 'NOT_FOUND', `Room '${roomSlug}' not found.`);
      }

      const destination = experienceNavigationService.enterRoom(roomSlug);
      sendSuccess(res, { enteredRoom: roomSlug }, destination);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RoomController();