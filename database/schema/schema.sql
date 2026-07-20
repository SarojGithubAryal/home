-- ============================================================
-- HOME PROJECT — PRODUCTION DATABASE SCHEMA (PostgreSQL / Neon)
-- Version: 1.0 (Clean)
-- Architecture: 05_DATABASE_ARCHITECTURE.md
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email             VARCHAR(255) UNIQUE NOT NULL,
    password_hash     VARCHAR(255) NOT NULL DEFAULT 'PLACEHOLDER_NOT_AUTHENTICATED',
    display_name      VARCHAR(150),
    avatar_url        TEXT,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. ROOMS
-- ============================================================
CREATE TABLE IF NOT EXISTS rooms (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name              VARCHAR(100) NOT NULL,
    slug              VARCHAR(100) UNIQUE NOT NULL,
    description       TEXT,
    icon              VARCHAR(50) NOT NULL DEFAULT 'room',
    cta_label         VARCHAR(50),
    display_order     INT NOT NULL DEFAULT 0,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure older databases have the cta_label column
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS cta_label VARCHAR(50);

-- ============================================================
-- 3. CONTENT TYPES
-- ============================================================
CREATE TABLE IF NOT EXISTS content_types (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name              VARCHAR(50) UNIQUE NOT NULL,
    slug              VARCHAR(50) UNIQUE NOT NULL,
    description       TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. CONTENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS contents (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id           UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    content_type_id   UUID NOT NULL REFERENCES content_types(id) ON DELETE RESTRICT,
    title             VARCHAR(300),
    body              TEXT,
    excerpt           VARCHAR(500),
    author            VARCHAR(200),
    recorded_at       DATE,
    is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
    is_published      BOOLEAN NOT NULL DEFAULT TRUE,
    display_order     INT NOT NULL DEFAULT 0,
    metadata          JSONB,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. MEDIA
-- ============================================================
CREATE TABLE IF NOT EXISTS media (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id        UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    media_type        VARCHAR(20) NOT NULL CHECK (media_type IN (
                          'image','audio','video','document','thumbnail','other'
                      )),
    url               TEXT NOT NULL,
    alt_text          VARCHAR(300),
    width             INT,
    height            INT,
    duration_seconds  INT,
    file_size_bytes   BIGINT,
    mime_type         VARCHAR(100),
    display_order     INT NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 6. MOODS
-- ============================================================
CREATE TABLE IF NOT EXISTS moods (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name              VARCHAR(50) UNIQUE NOT NULL,
    slug              VARCHAR(50) UNIQUE NOT NULL,
    description       TEXT,
    icon              VARCHAR(50),
    display_order     INT NOT NULL DEFAULT 0,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 7. THEMES
-- ============================================================
CREATE TABLE IF NOT EXISTS themes (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name              VARCHAR(50) UNIQUE NOT NULL,
    slug              VARCHAR(50) UNIQUE NOT NULL,
    hero_variant      VARCHAR(50) NOT NULL,
    palette           VARCHAR(50),
    paper_style       VARCHAR(50),
    decoration_pack   VARCHAR(50),
    ambient_audio     VARCHAR(50),
    description       TEXT,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 8. GREETINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS greetings (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text              TEXT NOT NULL,
    time_of_day       VARCHAR(20) CHECK (time_of_day IN (
                          'morning','afternoon','evening','night','any'
                      )) DEFAULT 'any',
    weather_condition VARCHAR(50),
    season            VARCHAR(20) CHECK (season IN (
                          'spring','summer','autumn','winter','any'
                      )) DEFAULT 'any',
    mood_id           UUID REFERENCES moods(id) ON DELETE SET NULL,
    language          VARCHAR(10) DEFAULT 'en',
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 9. DAILY MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_messages (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text              TEXT NOT NULL,
    subtext           TEXT,
    author            VARCHAR(200),
    source            VARCHAR(300),
    scheduled_date    DATE,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure older databases have the subtext column
ALTER TABLE daily_messages ADD COLUMN IF NOT EXISTS subtext TEXT;

-- ============================================================
-- 10. RECOMMENDATION RULES
-- ============================================================
CREATE TABLE IF NOT EXISTS recommendation_rules (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name              VARCHAR(150) NOT NULL,
    description       TEXT,
    mood_id           UUID REFERENCES moods(id) ON DELETE SET NULL,
    content_type_id   UUID REFERENCES content_types(id) ON DELETE SET NULL,
    time_of_day       VARCHAR(20) CHECK (time_of_day IN (
                          'morning','afternoon','evening','night','any'
                      )) DEFAULT 'any',
    weather_condition VARCHAR(50),
    season            VARCHAR(20) CHECK (season IN (
                          'spring','summer','autumn','winter','any'
                      )) DEFAULT 'any',
    priority          INT NOT NULL DEFAULT 0,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 11. ROOM THEMES (junction)
-- ============================================================
CREATE TABLE IF NOT EXISTS room_themes (
    room_id           UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    theme_id          UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    is_default        BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (room_id, theme_id)
);

-- ============================================================
-- 12. CONTENT MOODS (junction)
-- ============================================================
CREATE TABLE IF NOT EXISTS content_moods (
    content_id        UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    mood_id           UUID NOT NULL REFERENCES moods(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, mood_id)
);

-- ============================================================
-- 13. USER FAVORITES
-- ============================================================
CREATE TABLE IF NOT EXISTS user_favorites (
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id        UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, content_id)
);

-- ============================================================
-- 14. USER BOOKMARKS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_bookmarks (
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id        UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    note              TEXT,
    position_seconds  INT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, content_id)
);

-- ============================================================
-- 15. USER SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_settings (
    user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    language          VARCHAR(10) DEFAULT 'en',
    theme_preference  VARCHAR(50),
    notification_enabled BOOLEAN DEFAULT TRUE,
    auto_play_audio   BOOLEAN DEFAULT FALSE,
    privacy_level     VARCHAR(20) CHECK (privacy_level IN (
                          'private','shared','public'
                      )) DEFAULT 'private',
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 16. USER MOOD HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS user_mood_history (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mood_id           UUID NOT NULL REFERENCES moods(id) ON DELETE CASCADE,
    recorded_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 17. USER ACTIVITY HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS user_activity_history (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type     VARCHAR(50) NOT NULL,
    room_id           UUID REFERENCES rooms(id) ON DELETE SET NULL,
    content_id        UUID REFERENCES contents(id) ON DELETE SET NULL,
    metadata          JSONB,
    occurred_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 18. USER ROOM PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_room_progress (
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id           UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    last_visited_at   TIMESTAMPTZ,
    visit_count       INT NOT NULL DEFAULT 0,
    completed_content_ids UUID[] DEFAULT '{}',
    PRIMARY KEY (user_id, room_id)
);

-- ============================================================
-- 19. HOME PAGE CONFIGURATION (single row)
-- ============================================================
CREATE TABLE IF NOT EXISTS home_config (
    id              BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id = TRUE),
    hero_subtitle   TEXT,
    footer_text     TEXT,
    footer_icon     VARCHAR(10)
);

-- ============================================================
-- 20. MOOD LANDING CONTENT (editable copy per mood)
-- ============================================================
CREATE TABLE IF NOT EXISTS mood_landing_contents (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mood_id           UUID NOT NULL REFERENCES moods(id) ON DELETE CASCADE,
    language          VARCHAR(10) NOT NULL DEFAULT 'en',
    version           INT NOT NULL DEFAULT 1,
    priority          INT NOT NULL DEFAULT 0,
    headline          TEXT NOT NULL,
    paragraph         TEXT,
    section_title     TEXT,
    section_subtitle  TEXT,
    alternative_text  TEXT,
    alternative_icon  VARCHAR(10),
    badge_text        VARCHAR(100),
    badge_emoji       VARCHAR(10),
    background_variant VARCHAR(50),
    theme_override    VARCHAR(50),
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (mood_id, language)
);

-- ============================================================
-- 21. DESTINATIONS (reusable navigable experiences)
-- ============================================================
CREATE TABLE IF NOT EXISTS destinations (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title                 VARCHAR(200) NOT NULL,
    subtitle              VARCHAR(300),
    emoji                 VARCHAR(10),
    thumbnail_asset_key   VARCHAR(100),
    navigation_experience VARCHAR(50) NOT NULL,
    navigation_params     JSONB NOT NULL DEFAULT '{}',
    display_order         INT NOT NULL DEFAULT 0,
    featured              BOOLEAN NOT NULL DEFAULT FALSE,
    glass_style           VARCHAR(50),
    accent                VARCHAR(50),
    is_active             BOOLEAN NOT NULL DEFAULT TRUE,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 22. MOOD LANDING DESTINATION LINKS (many-to-many)
-- ============================================================
CREATE TABLE IF NOT EXISTS mood_landing_destination_links (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id      UUID NOT NULL REFERENCES mood_landing_contents(id) ON DELETE CASCADE,
    destination_id  UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    display_order   INT NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (content_id, destination_id)
);

-- ============================================================
-- 23. MOOD LANDING ROOM ENTRIES (room visibility per mood)
-- ============================================================
CREATE TABLE IF NOT EXISTS mood_landing_room_entries (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id        UUID NOT NULL REFERENCES mood_landing_contents(id) ON DELETE CASCADE,
    room_id           UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    title_override    VARCHAR(200),
    subtitle_override VARCHAR(300),
    emoji_override    VARCHAR(10),
    image_variant     VARCHAR(100),       -- AssetRegistry key (e.g., 'mom-mug')
    display_order     INT NOT NULL DEFAULT 0,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (content_id, room_id)
);

-- ============================================================
-- ROOM CONFIGURATION (per‑room settings)
-- ============================================================
CREATE TABLE IF NOT EXISTS room_config (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id                 UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    hero_subtitle           TEXT,
    hero_background_asset_key VARCHAR(100),
    last_updated_label      VARCHAR(200),
    footer_icon             VARCHAR(10),
    footer_decorative_asset VARCHAR(100),
    footer_text             TEXT,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (room_id)
);

-- ============================================================
-- ROOM SECTIONS (generic content sections)
-- ============================================================
CREATE TABLE IF NOT EXISTS room_sections (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id         UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    section_type    VARCHAR(50) NOT NULL,      -- e.g. 'featured', 'actions', 'highlights'
    title           VARCHAR(200),
    subtitle        VARCHAR(300),
    icon_key        VARCHAR(100),
    asset_key       VARCHAR(100),
    display_order   INT NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ROOM SECTION ITEMS (content items inside a section)
-- ============================================================
CREATE TABLE IF NOT EXISTS room_section_items (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id              UUID NOT NULL REFERENCES room_sections(id) ON DELETE CASCADE,
    title                   VARCHAR(200),
    subtitle                VARCHAR(300),
    thumbnail_asset_key     VARCHAR(100),
    duration_label          VARCHAR(50),
    badge_text              VARCHAR(50),
    role                    VARCHAR(20) DEFAULT 'default',   -- 'primary', 'secondary', or 'default'
    display_order           INT NOT NULL DEFAULT 0,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    navigation_experience   VARCHAR(50),
    navigation_params       JSONB,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_rooms_slug ON rooms(slug);
CREATE INDEX IF NOT EXISTS idx_rooms_active ON rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_contents_room ON contents(room_id);
CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(content_type_id);
CREATE INDEX IF NOT EXISTS idx_contents_featured ON contents(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_contents_published ON contents(is_published) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_contents_metadata ON contents USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_media_content ON media(content_id);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(media_type);
CREATE INDEX IF NOT EXISTS idx_moods_slug ON moods(slug);
CREATE INDEX IF NOT EXISTS idx_moods_active ON moods(is_active);
CREATE INDEX IF NOT EXISTS idx_themes_slug ON themes(slug);
CREATE INDEX IF NOT EXISTS idx_themes_active ON themes(is_active);
CREATE INDEX IF NOT EXISTS idx_greetings_active ON greetings(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_greetings_time ON greetings(time_of_day);
CREATE INDEX IF NOT EXISTS idx_greetings_weather ON greetings(weather_condition);
CREATE INDEX IF NOT EXISTS idx_rec_rules_active ON recommendation_rules(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_rec_rules_mood ON recommendation_rules(mood_id);
CREATE INDEX IF NOT EXISTS idx_rec_rules_priority ON recommendation_rules(priority DESC);
CREATE INDEX IF NOT EXISTS idx_fav_user ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_fav_content ON user_favorites(content_id);
CREATE INDEX IF NOT EXISTS idx_bm_user ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bm_content ON user_bookmarks(content_id);
CREATE INDEX IF NOT EXISTS idx_activity_user ON user_activity_history(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_type ON user_activity_history(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_time ON user_activity_history(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_history_user ON user_mood_history(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_history_time ON user_mood_history(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_room_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_date ON daily_messages(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_daily_active ON daily_messages(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_room_themes_room ON room_themes(room_id);
CREATE INDEX IF NOT EXISTS idx_room_themes_theme ON room_themes(theme_id);
CREATE INDEX IF NOT EXISTS idx_content_moods_content ON content_moods(content_id);
CREATE INDEX IF NOT EXISTS idx_content_moods_mood ON content_moods(mood_id);

-- ============================================================
-- UPDATED-AT TRIGGERS (auto-update updated_at)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_rooms_updated_at') THEN
        CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_contents_updated_at') THEN
        CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON contents
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_settings_updated_at') THEN
        CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END;
$$;

-- ============================================================
-- INITIAL SEED: CONTENT TYPES (architectural minimum)
-- ============================================================
INSERT INTO content_types (name, slug, description) VALUES
    ('Letter',     'letter',     'Personal letters'),
    ('Photo',      'photo',      'Photographs and images'),
    ('Audio',      'audio',      'Audio recordings, voice messages'),
    ('Video',      'video',      'Video recordings'),
    ('Memory',     'memory',     'Personal memories and stories'),
    ('Quote',      'quote',      'Meaningful quotes'),
    ('Journal',    'journal',    'Journal entries'),
    ('Story',      'story',      'Longer narrative stories'),
    ('Note',       'note',       'Short notes and thoughts')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- BOOTSTRAP SINGLE OWNER (idempotent)
-- ============================================================
INSERT INTO users (id, email, password_hash, display_name, is_active)
SELECT uuid_generate_v4(), 'owner@home.local', 'PLACEHOLDER_NOT_AUTHENTICATED', 'Me', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users LIMIT 1);