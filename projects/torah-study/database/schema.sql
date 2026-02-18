-- Torah Study App Database Schema
-- PostgreSQL 14+

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cache des textes Sefaria
CREATE TABLE IF NOT EXISTS cached_texts (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(255) UNIQUE NOT NULL,  -- "Genesis 1:1", "Bereshit 1:1"
    hebrew TEXT NOT NULL,
    translation TEXT,
    category VARCHAR(100),
    source VARCHAR(50) DEFAULT 'Sefaria',
    source_url TEXT,
    metadata JSONB,  -- Additional data (commentaries, links, etc.)
    cached_at TIMESTAMP DEFAULT NOW(),
    last_accessed TIMESTAMP DEFAULT NOW(),
    access_count INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cached_texts_reference ON cached_texts(reference);
CREATE INDEX IF NOT EXISTS idx_cached_texts_category ON cached_texts(category);
CREATE INDEX IF NOT EXISTS idx_cached_texts_cached_at ON cached_texts(cached_at);
CREATE INDEX IF NOT EXISTS idx_cached_texts_last_accessed ON cached_texts(last_accessed);

-- Historique de recherches
CREATE TABLE IF NOT EXISTS search_history (
    id SERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    filters JSONB,
    searched_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_history_searched_at ON search_history(searched_at);

-- Favoris utilisateur (pour phase 2 avec authentification)
CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,  -- Future foreign key
    reference VARCHAR(255) NOT NULL,
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_reference ON user_favorites(reference);

-- Function to update last_accessed and access_count
CREATE OR REPLACE FUNCTION update_cache_access()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_accessed = NOW();
    NEW.access_count = OLD.access_count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update cache access
CREATE TRIGGER trigger_update_cache_access
    BEFORE UPDATE ON cached_texts
    FOR EACH ROW
    EXECUTE FUNCTION update_cache_access();

-- Function to clean old cache entries
CREATE OR REPLACE FUNCTION clean_old_cache(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM cached_texts
    WHERE last_accessed < NOW() - (days_old || ' days')::INTERVAL
    AND access_count < 2;  -- Keep frequently accessed entries

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE cached_texts IS 'Cached texts from Sefaria API to reduce API calls';
COMMENT ON TABLE search_history IS 'History of user searches for analytics';
COMMENT ON TABLE user_favorites IS 'User bookmarked texts with personal notes';
COMMENT ON FUNCTION clean_old_cache IS 'Removes cache entries older than specified days with low access count';
