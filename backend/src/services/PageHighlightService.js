const pageHighlightRepository = require('../repositories/PageHighlightRepository');

class PageHighlightService {
  /**
   * Get a random active quote for a given page type and optional room.
   * Returns null if no quote exists.
   */
  async getRandomQuote(pageType, roomSlug = null) {
    const highlights = await pageHighlightRepository.findActiveByPageType(pageType, roomSlug);
    if (!highlights.length) return null;
    // Repository already returns rows ordered by priority and randomly;
    // we can just pick the first one.
    return highlights[0];
  }
}

module.exports = new PageHighlightService();