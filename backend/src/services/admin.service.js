const pool = require('../config/database');
const auditLogger = require('../utils/auditLogger');
const uploadMediaUtil = require('../utils/uploadMedia');   // single import at the top

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

    let query = `
      SELECT DISTINCT c.*
      FROM contents c
      JOIN content_types ct ON c.content_type_id = ct.id
    `;
    const joins = [];
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (type) {
      conditions.push(`ct.slug = $${paramIndex++}`);
      params.push(type);
    }

    if (room) {
      joins.push(`JOIN rooms r ON c.room_id = r.id`);
      conditions.push(`r.slug = $${paramIndex++}`);
      params.push(room);
    }

    if (mood) {
      joins.push(`JOIN content_moods cm ON c.id = cm.content_id`);
      joins.push(`JOIN moods m ON cm.mood_id = m.id`);
      conditions.push(`m.slug = $${paramIndex++}`);
      params.push(mood);
    }

    if (status) {
      switch (status) {
        case 'draft':
          conditions.push('c.is_published = FALSE');
          break;
        case 'published':
          conditions.push('c.is_published = TRUE');
          break;
        case 'scheduled':
          conditions.push('FALSE');
          break;
        default:
          break;
      }
    }

    if (search) {
      conditions.push(
        `(c.title ILIKE $${paramIndex} OR c.body ILIKE $${paramIndex} OR c.author ILIKE $${paramIndex} OR c.excerpt ILIKE $${paramIndex})`
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += joins.length ? ' ' + joins.join(' ') : '';
    query += conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';

    const sortableFields = {
      created_at: 'c.created_at',
      updated_at: 'c.updated_at',
      title: 'c.title',
      display_order: 'c.display_order',
    };
    const sortColumn = sortableFields[sort] || 'c.created_at';
    const direction = order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortColumn} ${direction}`;

    const countQuery = `SELECT COUNT(*) FROM (${query}) AS sub`;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const totalResult = await pool.query(countQuery, params.slice(0, -2));
    const total = parseInt(totalResult.rows[0].count);
    const result = await pool.query(query, params);

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

  async createContent(data, mediaIds = []) {
    const { room_id, content_type_id, title, body, excerpt, author, metadata, is_published, is_featured } = data;
    const result = await pool.query(
      `INSERT INTO contents (room_id, content_type_id, title, body, excerpt, author, metadata, is_published, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [room_id, content_type_id, title, body, excerpt, author, metadata || {}, is_published ?? true, is_featured ?? false]
    );
    const content = result.rows[0];

    if (mediaIds.length > 0) {
      for (const mediaId of mediaIds) {
        await pool.query(`UPDATE media SET content_id = $1 WHERE id = $2`, [content.id, mediaId]);
      }
    }

    auditLogger.log('CREATE', 'content', content.id);
    return content;
  }

  async updateContent(id, data) {
    // Extract media-related fields before building the dynamic query
    const { mediaIds, thumbnailMediaId, ...contentFields } = data;

    // Update content columns (excluding mediaIds and thumbnailMediaId)
    const fields = [];
    const values = [];
    let idx = 1;
    for (const [key, value] of Object.entries(contentFields)) {
      if (value !== undefined) {
        fields.push(`${key} = $${idx}`);
        values.push(value);
        idx++;
      }
    }
    if (fields.length > 0) {
      values.push(id);
      const result = await pool.query(
        `UPDATE contents SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      if (result.rows.length) auditLogger.log('UPDATE', 'content', id);
    }

    // Link provided media IDs (append, not replace)
    if (mediaIds && mediaIds.length > 0) {
      for (const mediaId of mediaIds) {
        // Only update if media exists (ignore invalid IDs)
        await pool.query(
          `UPDATE media SET content_id = $1 WHERE id = $2 AND content_id IS NULL`,
          [id, mediaId]
        );
      }
    }

    // Set thumbnail if requested
    if (thumbnailMediaId) {
      // Verify the media exists and is attached to this content (or unattached)
      const mediaResult = await pool.query(
        `SELECT * FROM media WHERE id = $1 AND (content_id = $2 OR content_id IS NULL)`,
        [thumbnailMediaId, id]
      );
      if (mediaResult.rows.length > 0) {
        const media = mediaResult.rows[0];
        // Update content metadata with thumbnail info
        await pool.query(
          `UPDATE contents SET metadata = jsonb_set(jsonb_set(COALESCE(metadata, '{}'), '{thumbnail_asset_key}', $1), '{thumbnail_media_id}', $2) WHERE id = $3`,
          [JSON.stringify(media.url), JSON.stringify(media.id), id]
        );
      }
    }

    // Return the updated content (refetch)
    return this.getContent(id);
  }

  async deleteContent(id) {
    // Fetch all media attached to this content
    const mediaResult = await pool.query('SELECT * FROM media WHERE content_id = $1', [id]);
    const mediaItems = mediaResult.rows;

    // Delete associated Dropbox files
    const DropboxService = require('../services/DropboxService');
    const env = require('../config/env');
    const dropbox = new DropboxService(env.dropboxAccessToken);

    for (const media of mediaItems) {
      const dropboxPath = media.metadata?.dropboxPath;
      if (dropboxPath) {
        try {
          await dropbox.deleteFile(dropboxPath);
          console.log(`Dropbox file deleted: ${dropboxPath}`);
        } catch (err) {
          if (err.status === 409 || (err.error && err.error.error_summary?.startsWith('path_lookup/not_found'))) {
            console.log(`Dropbox file already missing: ${dropboxPath}`);
          } else {
            // Genuine failure – abort content deletion to avoid orphaned files
            console.error(`Failed to delete Dropbox file (${dropboxPath}) for content ${id}:`, err.message);
            throw new Error(`Cannot delete content ${id} because a Dropbox file could not be removed.`);
          }
        }
      }
    }

    // Delete the content row; DB cascade will remove associated media rows automatically
    const result = await pool.query('DELETE FROM contents WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length) {
      auditLogger.log('DELETE', 'content', id);
      return true;
    }
    return false;
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
    const results = {};
    if (data.greetings) {
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

  // ========== MEDIA ==========

  async uploadMedia(file) {
    const { originalname, buffer, mimetype } = file;
    const dropboxPath = `/uploads/${Date.now()}-${originalname}`;

    try {
      // Upload to Dropbox (using the single import at the top)
      await uploadMediaUtil.upload(buffer, {
        provider: 'dropbox',
        dropboxPath,
        mimeType: mimetype,
      });

      // Get shared link
      const dropboxProvider = uploadMediaUtil.getProvider('dropbox');
      const sharedUrl = await dropboxProvider.getSharedLink(dropboxPath);

      // Insert media record
      const result = await pool.query(
        `INSERT INTO media (content_id, media_type, url, alt_text, file_size_bytes, mime_type, width, height, duration_seconds)
         VALUES (NULL, $1, $2, $3, $4, $5, NULL, NULL, NULL) RETURNING *`,
        [
          this._mapMimeToMediaType(mimetype),
          sharedUrl,
          originalname,
          buffer.length,
          mimetype,
        ]
      );

      const media = result.rows[0];
      await pool.query(`UPDATE media SET metadata = $1 WHERE id = $2`, [
        { dropboxPath },
        media.id,
      ]);

      auditLogger.log('UPLOAD', 'media', media.id);
      return media;
    } catch (err) {
      if (err.status === 401 || (err.error && err.error.status === 401)) {
        throw new Error('Dropbox authentication failed. Please check your DROPBOX_ACCESS_TOKEN.');
      }
      throw err;
    }
  }

  async updateMedia(mediaId, file) {
    const existing = await pool.query('SELECT * FROM media WHERE id = $1', [mediaId]);
    if (!existing.rows.length) return null;

    const oldMedia = existing.rows[0];
    const oldDropboxPath = oldMedia.metadata?.dropboxPath;

    // 1. Upload the new file to Dropbox first (never touch the old file yet)
    const { originalname, buffer, mimetype } = file;
    const newDropboxPath = `/uploads/${Date.now()}-${originalname}`;
    let newSharedUrl;

    try {
      await uploadMediaUtil.upload(buffer, { provider: 'dropbox', dropboxPath: newDropboxPath, mimeType: mimetype });
      const dropboxProvider = uploadMediaUtil.getProvider('dropbox');
      newSharedUrl = await dropboxProvider.getSharedLink(newDropboxPath);
    } catch (uploadErr) {
      // If new upload fails, old file and DB remain untouched
      if (uploadErr.status === 401 || (uploadErr.error && uploadErr.error.status === 401)) {
        throw new Error('Dropbox authentication failed. Please check your DROPBOX_ACCESS_TOKEN.');
      }
      throw uploadErr;
    }

    // 2. Update the database to point to the new file
    const result = await pool.query(
      `UPDATE media SET url=$1, file_size_bytes=$2, mime_type=$3, alt_text=$4, metadata=$5 WHERE id=$6 RETURNING *`,
      [newSharedUrl, buffer.length, mimetype, originalname, { dropboxPath: newDropboxPath }, mediaId]
    );
    const updatedMedia = result.rows[0];

    // 3. Attempt to delete the OLD Dropbox file (best-effort, after successful replacement)
    if (oldDropboxPath) {
      try {
        const DropboxService = require('../services/DropboxService');
        const env = require('../config/env');
        const dropbox = new DropboxService(env.dropboxAccessToken);
        await dropbox.deleteFile(oldDropboxPath);
        console.log(`Old Dropbox file deleted: ${oldDropboxPath}`);
      } catch (err) {
        // Log but do not fail – the new file is already safe and DB points to it
        console.error(`Failed to delete old Dropbox file (${oldDropboxPath}) after successful replacement:`, err.message);
      }
    }

    auditLogger.log('REPLACE', 'media', mediaId);
    return updatedMedia;
  }

  async deleteMedia(mediaId) {
    const existing = await pool.query('SELECT * FROM media WHERE id = $1', [mediaId]);
    if (!existing.rows.length) return false;

    const media = existing.rows[0];
    const dropboxPath = media.metadata?.dropboxPath;

    // Attempt Dropbox deletion first
    let dropboxClean = true;
    if (dropboxPath) {
      try {
        const DropboxService = require('../services/DropboxService');
        const env = require('../config/env');
        const dropbox = new DropboxService(env.dropboxAccessToken);
        await dropbox.deleteFile(dropboxPath);
        console.log(`Dropbox file deleted: ${dropboxPath}`);
      } catch (err) {
        // If file is already missing, treat as success
        if (err.status === 409 || (err.error && err.error.error_summary?.startsWith('path_lookup/not_found'))) {
          console.log(`Dropbox file already missing: ${dropboxPath}`);
        } else {
          // Genuine failure – preserve DB record and return error
          console.error(`Failed to delete Dropbox file (${dropboxPath}):`, err.message);
          return false;
        }
      }
    }

    // Delete DB record only after Dropbox cleanup is confirmed (or file was already gone)
    await pool.query('DELETE FROM media WHERE id = $1', [mediaId]);
    auditLogger.log('DELETE', 'media', mediaId);
    return true;
  }
  _mapMimeToMediaType(mime) {
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('audio/')) return 'audio';
    if (mime.startsWith('video/')) return 'video';
    if (mime.includes('pdf') || mime.includes('document') || mime.includes('text')) return 'document';
    return 'other';
  }
}

module.exports = new AdminService();