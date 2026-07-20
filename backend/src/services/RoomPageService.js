const roomPageRepository = require('../repositories/RoomPageRepository');

class RoomPageService {
  /**
   * Fetch all page data for a room in a generic shape.
   * Returns { config, sections } where sections is an array of objects
   * each containing the section fields plus an `items` array.
   */
  async getPageData(roomId) {
    const config = await roomPageRepository.findConfigByRoomId(roomId);
    const sections = await roomPageRepository.findSectionsByRoomId(roomId);

    const sectionsWithItems = await Promise.all(
      sections.map(async (section) => {
        const items = await roomPageRepository.findItemsBySectionId(section.id);
        return {
          ...section,
          items,
        };
      })
    );

    return {
      config,
      sections: sectionsWithItems,
    };
  }
}

module.exports = new RoomPageService();