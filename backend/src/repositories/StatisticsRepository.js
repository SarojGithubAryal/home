const BaseRepository = require('./BaseRepository');

class StatisticsRepository extends BaseRepository {
  constructor() {
    super('contents');
  }

  /**
   * Compute raw aggregate values for given room and content‑type slugs.
   * Returns an object keyed by stat_id for easy lookup.
   */
  async computeStats(roomId, contentTypeSlugs) {
    if (!contentTypeSlugs || !contentTypeSlugs.length) {
      return {};
    }

    const placeholders = contentTypeSlugs.map((_, i) => `$${i + 2}`).join(', ');
    const result = await this.query(
      `SELECT
         COUNT(*)::int AS total_items,
         COALESCE(SUM(COALESCE((contents.metadata->>'duration_seconds')::numeric, 0)), 0) AS total_duration_seconds,
         COALESCE(SUM(COALESCE((contents.metadata->>'reading_minutes')::numeric, 0)) * 60, 0) AS total_reading_seconds,
         MIN(contents.recorded_at) AS oldest_date,
         MAX(contents.recorded_at) AS newest_date
       FROM contents
       JOIN content_types ct ON ct.id = contents.content_type_id
       WHERE contents.room_id = $1
         AND ct.slug IN (${placeholders})
         AND contents.is_published = TRUE`,
      [roomId, ...contentTypeSlugs]
    );
    const row = result.rows[0];
    return {
      total_items: row.total_items,
      total_duration_seconds: row.total_duration_seconds + row.total_reading_seconds,
      oldest_date: row.oldest_date,
      newest_date: row.newest_date,
    };
  }
}

module.exports = new StatisticsRepository();