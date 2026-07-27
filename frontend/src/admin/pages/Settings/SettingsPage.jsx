/**
 * SettingsPage.jsx
 *
 * Renders ONLY fields the backend actually returns from
 * GET /admin/settings: language, theme_preference,
 * notification_enabled, auto_play_audio, privacy_level.
 *
 * Deliberately omitted (present in the reference image, absent from
 * the documented backend response): Storage & Integrations
 * (Dropbox/Google Drive), Default Room, App Language row (separate
 * from `language`, unclear if same field — kept as one row using the
 * real `language` field), Time Zone, Weather Source, AI
 * Recommendations toggle + Recommendation Rules, System section
 * (Backup/Logs/Clear Cache), "Everything is up to date" banner.
 * Adding any of these would require fabricating data the backend
 * doesn't provide. Remove this comment once/if the backend adds the
 * corresponding fields.
 */

import React, { useState } from 'react';
import useAdminSettings from '../../hooks/useAdminSettings';
import './SettingsPage.css';

const PRIVACY_LEVELS = ['private', 'shared', 'public'];

function SettingRow({ icon, label, value, onEdit }) {
  return (
    <div className="settings-row">
      <span className="settings-row-icon" aria-hidden="true">{icon}</span>
      <div className="settings-row-body">
        <span className="settings-row-label">{label}</span>
        <span className="settings-row-value">{value ?? '—'}</span>
      </div>
      {onEdit && (
        <button type="button" className="settings-row-edit" onClick={onEdit}>
          Edit <span aria-hidden="true">›</span>
        </button>
      )}
    </div>
  );
}

function ToggleRow({ icon, label, value, onToggle, disabled }) {
  return (
    <div className="settings-row">
      <span className="settings-row-icon" aria-hidden="true">{icon}</span>
      <div className="settings-row-body">
        <span className="settings-row-label">{label}</span>
        <span className={`settings-row-status ${value ? 'settings-row-status--on' : ''}`}>
          {value ? 'Enabled' : 'Disabled'}
        </span>
      </div>
      <label className="settings-toggle">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={() => onToggle(!value)}
          disabled={disabled}
        />
        <span className="settings-toggle-track" aria-hidden="true" />
      </label>
    </div>
  );
}

export default function SettingsPage() {
  const { data, loading, error, isSaving, refetch, saveSettings } = useAdminSettings();
  const [editField, setEditField] = useState(null); // 'language' | 'theme_preference' | 'privacy_level' | null
  const [editValue, setEditValue] = useState('');

  if (loading) {
    return <div className="admin-placeholder">Loading settings…</div>;
  }

  if (error) {
    return (
      <div className="admin-placeholder">
        <p>Failed to load settings.</p>
        <p>{error.message}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-placeholder">
        <p>No settings received.</p>
        <button onClick={refetch}>Refresh</button>
      </div>
    );
  }

  const openEdit = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue ?? '');
  };

  const closeEdit = () => {
    setEditField(null);
    setEditValue('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    await saveSettings({ [editField]: editValue });
    closeEdit();
  };

  const handleToggle = (field, nextValue) => {
    saveSettings({ [field]: nextValue });
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Settings</h2>
        <p className="settings-subtitle">App settings and preferences</p>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Preferences</h3>
        <div className="settings-card">
          <SettingRow
            icon="🌐"
            label="Language"
            value={data.language}
            onEdit={() => openEdit('language', data.language)}
          />
          <SettingRow
            icon="🎨"
            label="Theme Preference"
            value={data.theme_preference}
            onEdit={() => openEdit('theme_preference', data.theme_preference)}
          />
          <SettingRow
            icon="🔒"
            label="Privacy Level"
            value={data.privacy_level}
            onEdit={() => openEdit('privacy_level', data.privacy_level)}
          />
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Notifications & Playback</h3>
        <div className="settings-card">
          <ToggleRow
            icon="🔔"
            label="Notifications"
            value={data.notification_enabled}
            onToggle={(next) => handleToggle('notification_enabled', next)}
            disabled={isSaving}
          />
          <ToggleRow
            icon="▶️"
            label="Auto-play Audio"
            value={data.auto_play_audio}
            onToggle={(next) => handleToggle('auto_play_audio', next)}
            disabled={isSaving}
          />
        </div>
      </div>

      {editField && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <form className="modal-form" onSubmit={handleSaveEdit}>
                <h3 className="modal-title">Edit {editField.replace('_', ' ')}</h3>

                {editField === 'privacy_level' ? (
                  <div className="form-field">
                    <label className="form-field-label">Privacy Level</label>
                    <div className="form-field-control">
                      <select value={editValue} onChange={(e) => setEditValue(e.target.value)}>
                        {PRIVACY_LEVELS.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="form-field">
                    <label className="form-field-label">Value</label>
                    <div className="form-field-control">
                      <input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}