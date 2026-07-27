const adminService = require('../services/admin.service');
const validator = require('../validators/admin.validator');
const { sendSuccess, sendError } = require('../middleware/responseHelper');

class AdminController {
  async dashboard(req, res, next) {
    try {
      const data = await adminService.buildDashboard();
      sendSuccess(res, data, null);
    } catch (err) {
      next(err);
    }
  }

  async listContent(req, res, next) {
    try {
      const { type, room, mood, status, search, sort, order, page, limit } = req.query;
      const data = await adminService.listContent({
        type, room, mood, status, search, sort, order, page, limit
      });
      sendSuccess(res, data, null);
    } catch (err) {
      next(err);
    }
  }

  async getContent(req, res, next) {
    try {
      const content = await adminService.getContent(req.params.id);
      if (!content) return sendError(res, 404, 'NOT_FOUND', 'Content not found');
      sendSuccess(res, { content }, null);
    } catch (err) {
      next(err);
    }
  }

  async createContent(req, res, next) {
    try {
      const { error } = validator.validateContent(req.body);
      if (error) return sendError(res, 400, 'VALIDATION_ERROR', error.message);

      const content = await adminService.createContent(req.body);
      sendSuccess(res, { content }, null);
    } catch (err) {
      next(err);
    }
  }

  async updateContent(req, res, next) {
    try {
      const { error } = validator.validateContent(req.body, true);
      if (error) return sendError(res, 400, 'VALIDATION_ERROR', error.message);

      const content = await adminService.updateContent(req.params.id, req.body);
      if (!content) return sendError(res, 404, 'NOT_FOUND', 'Content not found');
      sendSuccess(res, { content }, null);
    } catch (err) {
      next(err);
    }
  }

  async deleteContent(req, res, next) {
    try {
      const success = await adminService.deleteContent(req.params.id);
      if (!success) return sendError(res, 404, 'NOT_FOUND', 'Content not found');
      sendSuccess(res, { deleted: true }, null);
    } catch (err) {
      next(err);
    }
  }

  async getExperience(req, res, next) {
    try {
      const data = await adminService.getExperience();
      sendSuccess(res, data, null);
    } catch (err) {
      next(err);
    }
  }

  async updateExperience(req, res, next) {
    try {
      const { error } = validator.validateExperience(req.body);
      if (error) return sendError(res, 400, 'VALIDATION_ERROR', error.message);

      const result = await adminService.updateExperience(req.body);
      sendSuccess(res, result, null);
    } catch (err) {
      next(err);
    }
  }

  async getSettings(req, res, next) {
    try {
      const settings = await adminService.getSettings();
      sendSuccess(res, settings, null);
    } catch (err) {
      next(err);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const { error } = validator.validateSettings(req.body);
      if (error) return sendError(res, 400, 'VALIDATION_ERROR', error.message);

      const settings = await adminService.updateSettings(req.body);
      sendSuccess(res, settings, null);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();