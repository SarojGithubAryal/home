-- Home project: complete database schema for Neon PostgreSQL
-- Apply this file directly to your Neon database.

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS moods (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(50) NOT NULL UNIQUE,
    emoji           VARCHAR(10),
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rooms (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_types (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS contents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255) NOT NULL,
    content_type_id UUID NOT NULL REFERENCES content_types(id),
    data            JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_moods (
    content_id      UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    mood_id         UUID NOT NULL REFERENCES moods(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, mood_id)
);

CREATE TABLE IF NOT EXISTS content_rooms (
    content_id      UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    room_id         UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, room_id)
);

CREATE TABLE IF NOT EXISTS tags (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS content_tags (
    content_id      UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    tag_id          UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, tag_id)
);

CREATE TABLE IF NOT EXISTS daily_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_text    TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS greetings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    greeting_text   TEXT NOT NULL,
    time_of_day     VARCHAR(20) CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS themes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS theme_assets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theme_id        UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    asset_url       VARCHAR(500) NOT NULL,
    asset_type      VARCHAR(50) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS weather_rules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weather_condition VARCHAR(100) NOT NULL,
    theme_id        UUID REFERENCES themes(id),
    content_id      UUID REFERENCES contents(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media_files (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_url        VARCHAR(500) NOT NULL,
    content_id      UUID REFERENCES contents(id) ON DELETE SET NULL,
    file_type       VARCHAR(50),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_schedule (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id      UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    schedule_time   TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorites (
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id      UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, content_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id      UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, content_id)
);

CREATE TABLE IF NOT EXISTS user_progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id      UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    progress        FLOAT DEFAULT 0.0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, content_id)
);

CREATE TABLE IF NOT EXISTS settings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    key             VARCHAR(255) NOT NULL,
    value           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action          VARCHAR(50) NOT NULL,
    table_name      VARCHAR(100),
    record_id       UUID,
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT now()
);