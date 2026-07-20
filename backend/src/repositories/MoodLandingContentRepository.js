const BaseRepository = require('./BaseRepository');

class MoodLandingContentRepository extends BaseRepository {
  constructor() {
    super('mood_landing_contents');
  }

  /**
   * Get the active landing content for a mood + language.
   * Returns the highest priority active row.
   */
  async findContentByMoodId(moodId, language = 'en') {
    const result = await this.query(
      `SELECT * FROM mood_landing_contents
       WHERE mood_id = $1 AND language = $2 AND is_active = TRUE
       ORDER BY priority DESC
       LIMIT 1`,
      [moodId, language]
    );
    return result.rows[0] || null;
  }

  /**
   * Get all active destinations for a specific content row.
   */
  /**
   * Fetch room entries for a landing content.
   * Returns room data + overrides merged into a single object.
   */
  async findRoomEntriesByContentId(contentId) {
    const result = await this.query(
      `SELECT
         r.id AS room_id,
         r.slug AS room_slug,
         r.name AS room_name,
         r.icon AS room_icon,
         r.description AS room_description,
         entry.id AS entry_id,
         COALESCE(entry.title_override, 'Visit ' || r.name) AS title,
         COALESCE(entry.subtitle_override, r.description) AS subtitle,
         COALESCE(entry.emoji_override, r.icon) AS emoji,
         COALESCE(entry.image_variant, r.icon) AS "imageVariant",
         entry.display_order
       FROM mood_landing_room_entries entry
       JOIN rooms r ON r.id = entry.room_id
       WHERE entry.content_id = $1
         AND entry.is_active = TRUE
         AND r.is_active = TRUE
       ORDER BY entry.display_order ASC`,
      [contentId]
    );
    return result.rows;
  }
}

module.exports = new MoodLandingContentRepository();