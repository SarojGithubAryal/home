const contentService = require('../services/ContentService');
const experienceEngine = require('../engines/ExperienceEngine');
const { sendSuccess, sendError } = require('../middleware/responseHelper');

class ContentController {
  /**
   * GET /api/contents/:contentId
   * Returns the fully assembled content detail, with common fields and
   * a type‑specific `detail` section.
   */
  async getContent(req, res, next) {
    try {
      const { contentId } = req.params;
      const content = await contentService.getContentById(contentId);

      if (!content) {
        return sendError(res, 404, 'NOT_FOUND', 'Content not found.');
      }

      const assembled = experienceEngine.assembleContentDetail(content);
      sendSuccess(res, { content: assembled }, null);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ContentController();