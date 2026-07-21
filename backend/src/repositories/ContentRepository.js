const BaseRepository = require('./BaseRepository');

class ContentRepository extends BaseRepository {
  constructor() {
    super('contents');
  }

  /**
   * Find all contents belonging to a specific room.
   */
  async findByRoomId(roomId) {
    const result = await this.query(
      `SELECT * FROM contents WHERE room_id = $1 AND is_published = TRUE ORDER BY display_order ASC`,
      [roomId]
    );
    return result.rows;
  }

  /**
   * Find contents by room and content type.
   */
  async findByRoomAndType(roomId, contentTypeId) {
    const result = await this.query(
      `SELECT * FROM contents WHERE room_id = $1 AND content_type_id = $2 AND is_published = TRUE ORDER BY display_order ASC`,
      [roomId, contentTypeId]
    );
    return result.rows;
  }

  /**
   * Find featured contents for a room.
   */
  async findFeaturedByRoomId(roomId) {
    const result = await this.query(
      `SELECT * FROM contents WHERE room_id = $1 AND is_featured = TRUE AND is_published = TRUE ORDER BY display_order ASC`,
      [roomId]
    );
    return result.rows;
  }

  /**
   * Fetch contents with dynamic filtering, sorting, search, and pagination.
   */
  async findPaginated({ roomId, contentTypeIds, sortOrder = 'newest', searchTerm = null, limit = 20, offset = 0 }) {
    let query = `SELECT * FROM contents WHERE room_id = $1 AND is_published = TRUE`;
    const params = [roomId];
    let paramIndex = 2;

    if (contentTypeIds && contentTypeIds.length) {
      query += ` AND content_type_id IN (${contentTypeIds.map((_, i) => `$${paramIndex + i}`).join(', ')})`;
      params.push(...contentTypeIds);
      paramIndex += contentTypeIds.length;
    }

    if (searchTerm) {
      query += ` AND (title ILIKE $${paramIndex} OR body ILIKE $${paramIndex})`;
      params.push(`%${searchTerm}%`);
      paramIndex++;
    }

    // Sorting
    switch (sortOrder) {
      case 'oldest':
        query += ' ORDER BY created_at ASC';
        break;
      case 'manual':
        query += ' ORDER BY display_order ASC';
        break;
      case 'newest':
      default:
        query += ' ORDER BY created_at DESC';
    }

    // Count total
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await this.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);

    // Apply pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await this.query(query, params);
    return { rows: result.rows, total };
  }

  /**
   * Fetch multiple contents by their IDs.
   */
  async findByIds(ids) {
    if (!ids.length) return [];
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
    const result = await this.query(
      `SELECT * FROM contents WHERE id IN (${placeholders}) AND is_published = TRUE`,
      ids
    );
    return result.rows;
  }
}

module.exports = new ContentRepository();