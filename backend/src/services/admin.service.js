const pool = require('../config/database');
const auditLogger = require('../utils/auditLogger');

class AdminService {
  // ========== DASHBOARD ==========
  async buildDashboard() {
    const client = await pool.connect();
    try {
      const totalContents = await client.query('SELECT COUNT(*) FROM contents');
      const totalGreetings = await client.query('SELECT COUNT(*) FROM greetings');
      const totalQuotes = await client.query('SELECT COUNT(*) FROM page_highlights WHERE type = $1', ['quote']);
      const activeSchedules = await client.query('SELECT COUNT(*) FROM daily_messages WHERE scheduled_date >= CURRENT_DATE');
      const recentUploads = await client.query('SELECT id, title, created_at FROM contents ORDER BY created_at DESC LIMIT 5');

      return {
        totalContents: parseInt(totalContents.rows[0].count),
        totalGreetings: parseInt(totalGreetings.rows[0].count),
        totalQuotes: parseInt(totalQuotes.rows[0].count),
        activeSchedules: parseInt(activeSchedules.rows[0].count),
        recentUploads: recentUploads.rows,
      };
    } finally {
      client.release();
    }
  }

  // ========== CONTENT ==========
  async listContent({
    type, room, mood, status, search,
    sort = 'created_at', order = 'desc',
    page = 1, limit = 20
  }) {
    const offset = (page - 1) * limit;

    // Base query – always join content_types for type filtering
    let query = `
      SELECT DISTINCT c.*
      FROM contents c
      JOIN content_types ct ON c.content_type_id = ct.id
    `;
    const joins = [];
    const conditions = ['c.is_published = TRUE'];   // default: only published? No, admin should see all. Remove this or make optional.
    // For admin, we do NOT restrict by is_published unless status filter is applied.
    // We'll treat status filter later.
    const params = [];
    let paramIndex = 1;

    // ---- FILTERS ----

    // type
    if (type) {
      conditions.push(`ct.slug = $${paramIndex++}`);
      params.push(type);
    }

    // room – join rooms table on c.room_id
    if (room) {
      joins.push(`JOIN rooms r ON c.room_id = r.id`);
      conditions.push(`r.slug = $${paramIndex++}`);
      params.push(room);
    }

    // mood – join content_moods and moods
    if (mood) {
      joins.push(`JOIN content_moods cm ON c.id = cm.content_id`);
      joins.push(`JOIN moods m ON cm.mood_id = m.id`);
      conditions.push(`m.slug = $${paramIndex++}`);
      params.push(mood);
    }

    // status filter
    if (status) {
      const now = new Date().toISOString();
      switch (status) {
        case 'draft':
          conditions.push('c.is_published = FALSE');
          break;
        case 'published':
          conditions.push('c.is_published = TRUE');
          // If publishDate column existed, we'd add: AND c.publish_date <= NOW()
          break;
        case 'scheduled':
          // No publish_date column yet – return empty set for safety
          conditions.push('FALSE');
          break;
        default:
          break;
      }
    }

    // search
    if (search) {
      conditions.push(
        `(c.title ILIKE $${paramIndex} OR c.body ILIKE $${paramIndex} OR c.author ILIKE $${paramIndex} OR c.excerpt ILIKE $${paramIndex})`
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Build the full WHERE clause
    query += joins.length ? ' ' + joins.join(' ') : '';
    query += conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';

    // ---- SORTING ----
    const sortableFields = {
      created_at: 'c.created_at',
      updated_at: 'c.updated_at',
      title: 'c.title',
      display_order: 'c.display_order',   // priority
    };
    const sortColumn = sortableFields[sort] || 'c.created_at';
    const direction = order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortColumn} ${direction}`;

    // ---- PAGINATION ----
    const countQuery = `SELECT COUNT(*) FROM (${query}) AS sub`;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const totalResult = await pool.query(countQuery, params.slice(0, -2));
    const total = parseInt(totalResult.rows[0].count);
    const result = await pool.query(query, params);

    // ---- AVAILABLE FILTERS (distinct values from DB) ----
    const [roomsResult, moodsResult, typesResult] = await Promise.all([
      pool.query(`SELECT DISTINCT r.slug FROM rooms r JOIN contents c ON c.room_id = r.id WHERE c.is_published = TRUE`),
      pool.query(`SELECT DISTINCT m.slug FROM moods m JOIN content_moods cm ON cm.mood_id = m.id JOIN contents c ON c.id = cm.content_id WHERE c.is_published = TRUE`),
      pool.query(`SELECT slug FROM content_types`)
    ]);

    return {
      items: result.rows,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        availableRooms: roomsResult.rows.map(r => r.slug),
        availableMoods: moodsResult.rows.map(r => r.slug),
        availableTypes: typesResult.rows.map(r => r.slug),
        availableStatuses: ['draft', 'scheduled', 'published'],
      },
    };
  }
  async getContent(id) {
    const result = await pool.query('SELECT * FROM contents WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createContent(data) {
    const { room_id, content_type_id, title, body, excerpt, author, metadata, is_published, is_featured } = data;
    const result = await pool.query(
      `INSERT INTO contents (room_id, content_type_id, title, body, excerpt, author, metadata, is_published, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [room_id, content_type_id, title, body, excerpt, author, metadata || {}, is_published ?? true, is_featured ?? false]
    );
    auditLogger.log('CREATE', 'content', result.rows[0].id);
    return result.rows[0];
  }

  async updateContent(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = $${idx}`);
        values.push(value);
        idx++;
      }
    }
    if (!fields.length) return null;
    values.push(id);
    const result = await pool.query(
      `UPDATE contents SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (result.rows.length) auditLogger.log('UPDATE', 'content', id);
    return result.rows[0] || null;
  }

  async deleteContent(id) {
    const result = await pool.query('DELETE FROM contents WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length) auditLogger.log('DELETE', 'content', id);
    return result.rows.length > 0;
  }

  // ========== EXPERIENCE ==========
  async getExperience() {
    const [greetings, quotes, homeConfig, recommendationRules, dailyMessages] = await Promise.all([
      pool.query('SELECT * FROM greetings ORDER BY created_at DESC'),
      pool.query('SELECT * FROM page_highlights ORDER BY created_at DESC'),
      pool.query('SELECT * FROM home_config WHERE id = TRUE'),
      pool.query('SELECT * FROM recommendation_rules ORDER BY priority DESC'),
      pool.query('SELECT * FROM daily_messages ORDER BY created_at DESC'),
    ]);
    return {
      greetings: greetings.rows,
      quotes: quotes.rows,
      homeConfig: homeConfig.rows[0] || null,
      recommendationRules: recommendationRules.rows,
      dailyMessages: dailyMessages.rows,
    };
  }

  async updateExperience(data) {
    // data contains sections like { greetings: [...], quotes: [...], homeConfig: {...}, ... }
    const results = {};
    if (data.greetings) {
      // we could upsert each greeting; for simplicity we'll truncate and re-insert? Safer to upsert by ID.
      for (const g of data.greetings) {
        if (g.id) {
          await pool.query(
            `UPDATE greetings SET text=$1, time_of_day=$2, weather_condition=$3, season=$4, mood_id=$5, language=$6, is_active=$7 WHERE id=$8`,
            [g.text, g.time_of_day, g.weather_condition, g.season, g.mood_id, g.language, g.is_active, g.id]
          );
        } else {
          await pool.query(
            `INSERT INTO greetings (text, time_of_day, weather_condition, season, mood_id, language, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [g.text, g.time_of_day, g.weather_condition, g.season, g.mood_id, g.language, g.is_active]
          );
        }
      }
      auditLogger.log('UPDATE', 'greetings');
    }
    if (data.quotes) {
      for (const q of data.quotes) {
        if (q.id) {
          await pool.query(
            `UPDATE page_highlights SET body=$1, author=$2, priority=$3, is_active=$4 WHERE id=$5`,
            [q.body, q.author, q.priority, q.is_active, q.id]
          );
        } else {
          await pool.query(
            `INSERT INTO page_highlights (page_type, type, body, author, priority, is_active) VALUES ($1,$2,$3,$4,$5,$6)`,
            [q.page_type || 'home', q.type || 'quote', q.body, q.author, q.priority || 0, q.is_active ?? true]
          );
        }
      }
      auditLogger.log('UPDATE', 'quotes');
    }
    if (data.homeConfig) {
      const { hero_subtitle, footer_text, footer_icon } = data.homeConfig;
      await pool.query(
        `UPDATE home_config SET hero_subtitle=$1, footer_text=$2, footer_icon=$3 WHERE id = TRUE`,
        [hero_subtitle, footer_text, footer_icon]
      );
      auditLogger.log('UPDATE', 'homeConfig');
    }
    if (data.recommendationRules) {
      for (const r of data.recommendationRules) {
        if (r.id) {
          await pool.query(
            `UPDATE recommendation_rules SET name=$1, description=$2, mood_id=$3, content_type_id=$4, time_of_day=$5, weather_condition=$6, season=$7, priority=$8, is_active=$9 WHERE id=$10`,
            [r.name, r.description, r.mood_id, r.content_type_id, r.time_of_day, r.weather_condition, r.season, r.priority, r.is_active, r.id]
          );
        } else {
          await pool.query(
            `INSERT INTO recommendation_rules (name, description, mood_id, content_type_id, time_of_day, weather_condition, season, priority, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [r.name, r.description, r.mood_id, r.content_type_id, r.time_of_day, r.weather_condition, r.season, r.priority, r.is_active]
          );
        }
      }
      auditLogger.log('UPDATE', 'recommendationRules');
    }
    if (data.dailyMessages) {
      for (const d of data.dailyMessages) {
        if (d.id) {
          await pool.query(
            `UPDATE daily_messages SET text=$1, subtext=$2, author=$3, source=$4, scheduled_date=$5, is_active=$6 WHERE id=$7`,
            [d.text, d.subtext, d.author, d.source, d.scheduled_date, d.is_active, d.id]
          );
        } else {
          await pool.query(
            `INSERT INTO daily_messages (text, subtext, author, source, scheduled_date, is_active) VALUES ($1,$2,$3,$4,$5,$6)`,
            [d.text, d.subtext, d.author, d.source, d.scheduled_date, d.is_active ?? true]
          );
        }
      }
      auditLogger.log('UPDATE', 'dailyMessages');
    }
    return results;
  }

  // ========== SETTINGS ==========
  async getSettings() {
    // For now, return user_settings of the owner
    const result = await pool.query('SELECT * FROM user_settings WHERE user_id = (SELECT id FROM users WHERE is_active LIMIT 1)');
    return result.rows[0] || {};
  }

  async updateSettings(settings) {
    const userId = (await pool.query('SELECT id FROM users WHERE is_active LIMIT 1')).rows[0]?.id;
    if (!userId) throw new Error('Owner not found');
    const existing = await pool.query('SELECT * FROM user_settings WHERE user_id = $1', [userId]);
    if (existing.rows.length) {
      await pool.query(
        `UPDATE user_settings SET language=$1, theme_preference=$2, notification_enabled=$3, auto_play_audio=$4, privacy_level=$5 WHERE user_id=$6`,
        [settings.language, settings.theme_preference, settings.notification_enabled, settings.auto_play_audio, settings.privacy_level, userId]
      );
    } else {
      await pool.query(
        `INSERT INTO user_settings (user_id, language, theme_preference, notification_enabled, auto_play_audio, privacy_level) VALUES ($1,$2,$3,$4,$5,$6)`,
        [userId, settings.language, settings.theme_preference, settings.notification_enabled, settings.auto_play_audio, settings.privacy_level]
      );
    }
    auditLogger.log('UPDATE', 'settings');
    return settings;
  }
}

module.exports = new AdminService();