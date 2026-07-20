/**
 * ThemeEngine
 *
 * Determines semantic visual decisions based on context.
 * Outputs ONLY semantic identifiers. Never asset filenames.
 */

class ThemeEngine {

  /**
   * Default fallback theme identifiers.
   */
  static DEFAULTS = {
    heroVariant: 'default',
    palette: 'warm',
    paperStyle: 'classic',
    decorationPack: 'none',
    ambientAudio: 'silence',
  };

  /**
   * Determine the theme for a given context.
   * @param {Object} params
   * @param {Object} [params.room]      - room domain object
   * @param {Object} [params.mood]      - selected mood (optional)
   * @param {Object} [params.weather]   - { condition } e.g. 'rain', 'clear'
   * @param {Object} [params.season]    - e.g. 'winter', 'spring'
   * @param {Object} [params.timeOfDay] - e.g. 'morning', 'evening'
   * @param {Array}  [params.themes]    - available theme objects for the room
   * @returns {Object} semantic theme identifiers
   */
  determine({ room, mood, weather, season, timeOfDay, themes = [] }) {
    // If specific themes exist for the room, try to match context
    if (themes.length) {
      const bestMatch = this._findBestMatch({ themes, weather, season, timeOfDay });
      if (bestMatch) return this._toSemantic(bestMatch);
    }

    // Otherwise build from context
    return {
      heroVariant: this._resolveHeroVariant({ weather, timeOfDay, season }),
      palette: this._resolvePalette({ season, mood }),
      paperStyle: this._resolvePaperStyle({ mood }),
      decorationPack: this._resolveDecorations({ season, weather }),
      ambientAudio: this._resolveAmbientAudio({ weather, timeOfDay }),
    };
  }

  /**
   * Pick the best matching theme object from the room's themes.
   */
  _findBestMatch({ themes, weather, season, timeOfDay }) {
    // Very simple matching for now: prefer theme whose slug matches weather or season
    for (const theme of themes) {
      const slug = (theme.slug || '').toLowerCase();
      if (weather && slug.includes(weather.condition)) return theme;
      if (season && slug.includes(season)) return theme;
      if (timeOfDay && slug.includes(timeOfDay)) return theme;
    }
    // Fallback: first theme marked as default
    const defaultTheme = themes.find(t => t.is_default);
    if (defaultTheme) return defaultTheme;
    // Fallback: first theme
    return themes[0] || null;
  }

  /**
   * Convert theme domain object to semantic identifiers.
   */
  _toSemantic(theme) {
    return {
      heroVariant: theme.hero_variant || ThemeEngine.DEFAULTS.heroVariant,
      palette: theme.palette || ThemeEngine.DEFAULTS.palette,
      paperStyle: theme.paper_style || ThemeEngine.DEFAULTS.paperStyle,
      decorationPack: theme.decoration_pack || ThemeEngine.DEFAULTS.decorationPack,
      ambientAudio: theme.ambient_audio || ThemeEngine.DEFAULTS.ambientAudio,
    };
  }

  _resolveHeroVariant({ weather, timeOfDay, season }) {
    if (weather?.condition === 'rain') return 'rain';
    if (weather?.condition === 'snow') return 'snow';
    if (timeOfDay === 'night') return 'night';
    if (season === 'autumn') return 'autumn';
    if (season === 'spring') return 'spring';
    return 'warm';
  }

  _resolvePalette({ season, mood }) {
    if (mood?.slug === 'calm') return 'soft';
    if (season === 'winter') return 'cool';
    return 'warm';
  }

  _resolvePaperStyle({ mood }) {
    if (mood?.slug === 'overwhelmed') return 'clean';
    return 'vintage';
  }

  _resolveDecorations({ season, weather }) {
    if (season === 'spring') return 'flowers';
    if (weather?.condition === 'rain') return 'rain_drops';
    return 'none';
  }

  _resolveAmbientAudio({ weather, timeOfDay }) {
    if (weather?.condition === 'rain') return 'rain_ambient';
    if (timeOfDay === 'night') return 'night_ambient';
    return 'silence';
  }
}

module.exports = new ThemeEngine();