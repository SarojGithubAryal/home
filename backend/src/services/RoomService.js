const roomRepository = require('../repositories/RoomRepository');
const contentRepository = require('../repositories/ContentRepository');
const mediaRepository = require('../repositories/MediaRepository');

class RoomService {
  /**
   * Get a single room by slug, including its contents and their media.
   * @param {string} slug
   * @returns {Promise<Object|null>} room domain object with contents and media, or null
   */
  async getRoomWithContents(slug) {
    const room = await roomRepository.findBySlug(slug);
    if (!room) return null;

    const contents = await contentRepository.findByRoomId(room.id);
    const contentsWithMedia = await Promise.all(
      contents.map(async (content) => {
        const media = await mediaRepository.findByContentId(content.id);
        return { ...content, media };
      })
    );

    return { ...room, contents: contentsWithMedia };
  }

  /**
   * Get all active rooms without contents (summary list).
   * @returns {Promise<Array>}
   */
  async getAllActiveRooms() {
    return roomRepository.findAllActive();
  }
}

module.exports = new RoomService();