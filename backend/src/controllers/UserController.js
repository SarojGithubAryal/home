const userService = require('../services/UserService');
const { sendSuccess, sendError } = require('../middleware/responseHelper');

class UserController {
  async getMe(req, res, next) {
    try {
      const user = await userService.getCurrentUser();
      if (!user) {
        return sendError(res, 404, 'NOT_FOUND', 'Owner profile not found.');
      }
      sendSuccess(res, user, null);
    } catch (err) {
      next(err);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const user = await userService.getCurrentUser();
      if (!user) {
        return sendError(res, 404, 'NOT_FOUND', 'Owner profile not found.');
      }
      const settings = await userService.saveSettings(user.id, req.body);
      sendSuccess(res, settings, null);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();