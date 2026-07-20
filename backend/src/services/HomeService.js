const roomRepository = require('../repositories/RoomRepository');
const dailyMessageRepository = require('../repositories/DailyMessageRepository');

class HomeService {
  /**
   * Retrieve all active rooms (sorted by display_order).
   * @returns {Promise<Array>} list of room domain objects
   */
  async getActiveRooms() {
    return roomRepository.findAllActive();
  }

  /**
   * Retrieve the daily message scheduled for today.
   * @returns {Promise<Object|null>} daily message domain object, or null
   */
  async getTodayMessage() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const message = await dailyMessageRepository.findByDate(today);
    if (message) return message;
    // fallback to latest active message if no specific match
    return dailyMessageRepository.findLatest();
  }
}

module.exports = new HomeService();