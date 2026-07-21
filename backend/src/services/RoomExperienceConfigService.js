const roomExperienceConfigRepository = require('../repositories/RoomExperienceConfigRepository');

class RoomExperienceConfigService {
  /**
   * Load configuration, tabs, and featured content IDs for a room + experience type.
   * Returns null if no config exists.
   */
  async getFullConfig(roomId, experienceType) {
    const config = await roomExperienceConfigRepository.findByRoomIdAndType(roomId, experienceType);
    if (!config) return null;

    const [tabs, featuredContentIds] = await Promise.all([
      roomExperienceConfigRepository.findTabsByConfigId(config.id),
      roomExperienceConfigRepository.findFeaturedContentIdsByConfigId(config.id),
    ]);

    return { config, tabs, featuredContentIds };
  }
}

module.exports = new RoomExperienceConfigService();