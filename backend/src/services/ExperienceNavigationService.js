/**
 * Pure navigation decision service.
 * Returns destination objects { experience, params }.
 * No database access, no business rules — just mapping user actions to experiences.
 */
class ExperienceNavigationService {
  selectMood(moodSlug) {
    return {
      experience: 'MOOD_LANDING',
      params: { moodSlug },
    };
  }

  enterRoom(roomSlug) {
    return {
      experience: 'ROOM',
      params: { roomSlug },
    };
  }

  // Future actions: hear, read, see, memory, etc.
}

module.exports = new ExperienceNavigationService();