const userRepository = require('../repositories/UserRepository');
const userSettingsRepository = require('../repositories/UserSettingsRepository');

class UserService {
  async getUserByEmail(email) {
    return userRepository.findByEmail(email);
  }

  async getUserWithSettings(userId) {
    const user = await userRepository.findById(userId);
    if (!user) return null;
    const settings = await userSettingsRepository.findByUserId(userId);
    return { ...user, settings: settings || null };
  }

  async getCurrentUser() {
    const user = await userRepository.findFirstActiveUser();
    if (!user) return null;
    const settings = await userSettingsRepository.findByUserId(user.id);
    return { ...user, settings: settings || null };
  }

  async saveSettings(userId, data) {
    return userSettingsRepository.upsert(userId, data);
  }
}

module.exports = new UserService();