import React, { useState } from 'react';
import useExperienceSettings from '../../hooks/useExperienceSettings';
import './ExperienceSettingsPage.css';

// Map time_of_day to display ranges (only for display)
const TIME_RANGES = {
  morning: '05:00 AM – 11:59 AM',
  afternoon: '12:00 PM – 4:59 PM',
  evening: '05:00 PM – 8:59 PM',
  night: '09:00 PM – 04:59 AM',
};

// ── Reusable card for list items ──────────────────────
function ListCard({ children, actions }) {
  return (
    <div className="list-card">
      <div className="list-card-content">{children}</div>
      <div className="list-card-actions">{actions}</div>
    </div>
  );
}

// ── Simple form field ─────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="form-field">
      <label className="form-field-label">{label}</label>
      <div className="form-field-control">{children}</div>
    </div>
  );
}

export default function ExperienceSettingsPage() {
  const {
    data,
    loading,
    error,
    refetch,
    addGreeting,
    updateGreeting,
    deleteGreeting,
    toggleGreetingActive,
    moveGreetingUp,
    moveGreetingDown,
    addQuote,
    updateQuote,
    deleteQuote,
    toggleQuoteActive,
    addMessage,
    updateMessage,
    deleteMessage,
    toggleMessageActive,
    updateHomeConfig,
  } = useExperienceSettings();

  // ── Modal states ─────────────────────────────────────
  const [modal, setModal] = useState(null); // { type: 'greeting', editId?, ... }
  const closeModal = () => setModal(null);

  // ── Reorder mode for greetings ───────────────────────
  const [reorderMode, setReorderMode] = useState(false);

  if (loading) return <div className="admin-placeholder">Loading experience configuration…</div>;
  if (error) {
    return (
      <div className="admin-placeholder">
        <p>Failed to load experience settings.</p>
        <p>{error.message}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="admin-placeholder">
        <p>No experience configuration received.</p>
        <button onClick={refetch}>Refresh</button>
      </div>
    );
  }

  const { greetings = [], quotes = [], homeConfig = {}, dailyMessages = [] } = data;

  // ── Helper to open forms ─────────────────────────────
  const openGreetingForm = (id = null) => {
    if (id) {
      const g = greetings.find((item) => item.id === id);
      if (g) setModal({ type: 'greeting', editId: id, initial: { ...g } });
    } else {
      setModal({ type: 'greeting', editId: null, initial: {} });
    }
  };

  const openQuoteForm = (id = null) => {
    if (id) {
      const q = quotes.find((item) => item.id === id);
      if (q) setModal({ type: 'quote', editId: id, initial: { ...q } });
    } else {
      setModal({ type: 'quote', editId: null, initial: {} });
    }
  };

  const openMessageForm = (id = null) => {
    if (id) {
      const m = dailyMessages.find((item) => item.id === id);
      if (m) setModal({ type: 'message', editId: id, initial: { ...m } });
    } else {
      setModal({ type: 'message', editId: null, initial: {} });
    }
  };

  const openHomeConfigForm = () => {
    setModal({ type: 'homeConfig', initial: { ...homeConfig } });
  };

  return (
    <div className="experience-page">
      {/* ── Header ──────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h2>Experience Settings</h2>
          <p className="page-subtitle">Manage greetings, quotes, daily messages and more</p>
        </div>
        <button className="btn btn-secondary" onClick={refetch} disabled={loading}>
          Refresh
        </button>
      </div>

      {/* ── Hero Subtitle & Footer ──────────────────── */}
      <div className="experience-section">
        <div className="section-header">
          <h3>Hero Subtitle</h3>
          <p className="section-description">Subtitle shown on the home hero section.</p>
        </div>
        <ListCard
          actions={[
            <button key="edit" className="btn btn-primary" onClick={openHomeConfigForm}>
              Edit
            </button>,
          ]}
        >
          <p className="config-item"><strong>Hero Subtitle:</strong> {homeConfig.hero_subtitle || '—'}</p>
          <p className="config-item"><strong>Footer Text:</strong> {homeConfig.footer_text || '—'}</p>
          <p className="config-item"><strong>Footer Icon:</strong> {homeConfig.footer_icon || '—'}</p>
        </ListCard>
      </div>

      {/* ── Greetings Section ───────────────────────── */}
      <div className="experience-section">
        <div className="section-header">
          <h3>Greetings</h3>
          <p className="section-description">Set the greetings shown based on time of the day.</p>
        </div>
        <div className="section-toolbar">
          <button className="btn btn-secondary" onClick={() => setReorderMode(!reorderMode)}>
            {reorderMode ? 'Done Reordering' : 'Manage Greetings Order'}
          </button>
          <button className="btn btn-primary" onClick={() => openGreetingForm()}>
            + Add Greeting
          </button>
        </div>

        {greetings.length === 0 ? (
          <div className="empty-state">No greetings added yet.</div>
        ) : (
          greetings.map((g, idx) => (
            <ListCard
              key={g.id}
              actions={[
                <button key="edit" className="btn btn-secondary" onClick={() => openGreetingForm(g.id)}>
                  Edit
                </button>,
                <button
                  key="del"
                  className="btn btn-secondary"
                  onClick={() => {
                    if (window.confirm('Delete?')) deleteGreeting(g.id);
                  }}
                >
                  Delete
                </button>,
                <label key="active" className="toggle-label">
                  <input
                    type="checkbox"
                    checked={g.is_active}
                    onChange={() => toggleGreetingActive(g.id)}
                  />
                  Active
                </label>,
                ...(reorderMode
                  ? [
                      <button
                        key="up"
                        className="btn btn-secondary"
                        disabled={idx === 0}
                        onClick={() => moveGreetingUp(idx)}
                      >
                        ↑
                      </button>,
                      <button
                        key="down"
                        className="btn btn-secondary"
                        disabled={idx === greetings.length - 1}
                        onClick={() => moveGreetingDown(idx)}
                      >
                        ↓
                      </button>,
                    ]
                  : []),
              ]}
            >
              <div className="greeting-item">
                <span className="greeting-text">{g.text}</span>
                <span className="greeting-time">{TIME_RANGES[g.time_of_day] || g.time_of_day}</span>
              </div>
              <div className="meta-badges">
                <span className={`status-badge ${g.is_active ? 'active' : 'inactive'}`}>
                  {g.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="language-tag">{g.language}</span>
              </div>
            </ListCard>
          ))
        )}
      </div>

      {/* ── Quotes Section ──────────────────────────── */}
      <div className="experience-section">
        <div className="section-header">
          <h3>Daily Quotes</h3>
          <p className="section-description">Manage quotes that appear daily in the app.</p>
        </div>
        <div className="section-toolbar">
          <button className="btn btn-primary" onClick={() => openQuoteForm()}>
            + Add Quote
          </button>
        </div>

        {quotes.length === 0 ? (
          <div className="empty-state">No quotes added yet.</div>
        ) : (
          quotes.map((q) => (
            <ListCard
              key={q.id}
              actions={[
                <button key="edit" className="btn btn-secondary" onClick={() => openQuoteForm(q.id)}>
                  Edit
                </button>,
                <button
                  key="del"
                  className="btn btn-secondary"
                  onClick={() => {
                    if (window.confirm('Delete?')) deleteQuote(q.id);
                  }}
                >
                  Delete
                </button>,
                <label key="active" className="toggle-label">
                  <input type="checkbox" checked={q.is_active} onChange={() => toggleQuoteActive(q.id)} />
                  Active
                </label>,
              ]}
            >
              <blockquote className="quote-body">“{q.body}”</blockquote>
              {q.author && <cite className="quote-author">— {q.author}</cite>}
              <div className="meta-badges">
                <span className="type-tag">{q.type}</span>
                <span className="page-tag">{q.page_type}</span>
                <span className="priority-tag">Priority: {q.priority}</span>
                <span className={`status-badge ${q.is_active ? 'active' : 'inactive'}`}>
                  {q.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </ListCard>
          ))
        )}
      </div>

      {/* ── Daily Messages Section ──────────────────── */}
      <div className="experience-section">
        <div className="section-header">
          <h3>Daily Status Messages</h3>
          <p className="section-description">Short messages shown on the home screen.</p>
        </div>
        <div className="section-toolbar">
          <button className="btn btn-primary" onClick={() => openMessageForm()}>
            + Add Message
          </button>
        </div>

        {dailyMessages.length === 0 ? (
          <div className="empty-state">No daily messages added yet.</div>
        ) : (
          dailyMessages.map((m) => (
            <ListCard
              key={m.id}
              actions={[
                <button key="edit" className="btn btn-secondary" onClick={() => openMessageForm(m.id)}>
                  Edit
                </button>,
                <button
                  key="del"
                  className="btn btn-secondary"
                  onClick={() => {
                    if (window.confirm('Delete?')) deleteMessage(m.id);
                  }}
                >
                  Delete
                </button>,
                <label key="active" className="toggle-label">
                  <input type="checkbox" checked={m.is_active} onChange={() => toggleMessageActive(m.id)} />
                  Active
                </label>,
              ]}
            >
              <p className="message-text">{m.text}</p>
              {m.subtext && <p className="message-subtext">{m.subtext}</p>}
              {m.author && <cite className="message-author">— {m.author}</cite>}
              {m.scheduled_date && (
                <p className="scheduled-date">Scheduled: {new Date(m.scheduled_date).toLocaleDateString()}</p>
              )}
              <span className={`status-badge ${m.is_active ? 'active' : 'inactive'}`}>
                {m.is_active ? 'Active' : 'Inactive'}
              </span>
            </ListCard>
          ))
        )}
      </div>

      {/* ── MODALS ──────────────────────────────────── */}
      {modal?.type === 'greeting' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <GreetingForm
                initial={modal.initial}
                onSave={(fields) => {
                  if (modal.editId) {
                    updateGreeting(modal.editId, fields);
                  } else {
                    addGreeting(fields);
                  }
                  closeModal();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {modal?.type === 'quote' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <QuoteForm
                initial={modal.initial}
                onSave={(fields) => {
                  if (modal.editId) {
                    updateQuote(modal.editId, fields);
                  } else {
                    addQuote(fields);
                  }
                  closeModal();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {modal?.type === 'message' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <MessageForm
                initial={modal.initial}
                onSave={(fields) => {
                  if (modal.editId) {
                    updateMessage(modal.editId, fields);
                  } else {
                    addMessage(fields);
                  }
                  closeModal();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {modal?.type === 'homeConfig' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <HomeConfigForm
                initial={modal.initial}
                onSave={(fields) => {
                  updateHomeConfig(fields);
                  closeModal();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── FORM COMPONENTS (styled via CSS) ────────────────

function GreetingForm({ initial, onSave }) {
  const [text, setText] = useState(initial.text || '');
  const [timeOfDay, setTimeOfDay] = useState(initial.time_of_day || 'morning');
  const [language, setLanguage] = useState(initial.language || 'en');
  const [isActive, setIsActive] = useState(initial.is_active !== undefined ? initial.is_active : true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ text, time_of_day: timeOfDay, language, is_active: isActive });
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <h3 className="modal-title">{initial.id ? 'Edit Greeting' : 'Add Greeting'}</h3>
      <Field label="Text *"><input value={text} onChange={(e) => setText(e.target.value)} required /></Field>
      <Field label="Time of Day">
        <select value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)}>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </select>
      </Field>
      <Field label="Language"><input value={language} onChange={(e) => setLanguage(e.target.value)} /></Field>
      <Field label="Active">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
      </Field>
      <div className="modal-actions">
        <button type="submit" className="btn btn-primary">
          {initial.id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

function QuoteForm({ initial, onSave }) {
  const [body, setBody] = useState(initial.body || '');
  const [author, setAuthor] = useState(initial.author || '');
  const [pageType, setPageType] = useState(initial.page_type || 'home');
  const [type, setType] = useState(initial.type || 'quote');
  const [priority, setPriority] = useState(initial.priority ?? 1);
  const [isActive, setIsActive] = useState(initial.is_active !== undefined ? initial.is_active : true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      body,
      author: author || null,
      page_type: pageType,
      type,
      priority: Number(priority),
      is_active: isActive,
    });
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <h3 className="modal-title">{initial.id ? 'Edit Quote' : 'Add Quote'}</h3>
      <Field label="Quote Body *">
        <textarea value={body} onChange={(e) => setBody(e.target.value)} required rows={3} />
      </Field>
      <Field label="Author"><input value={author} onChange={(e) => setAuthor(e.target.value)} /></Field>
      <Field label="Page Type">
        <select value={pageType} onChange={(e) => setPageType(e.target.value)}>
          <option value="home">Home</option>
          <option value="daily">Daily</option>
        </select>
      </Field>
      <Field label="Type">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="quote">Quote</option>
          <option value="affirmation">Affirmation</option>
          <option value="seasonal">Seasonal</option>
          <option value="announcement">Announcement</option>
        </select>
      </Field>
      <Field label="Priority">
        <input type="number" value={priority} onChange={(e) => setPriority(e.target.value)} />
      </Field>
      <Field label="Active">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
      </Field>
      <div className="modal-actions">
        <button type="submit" className="btn btn-primary">
          {initial.id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

function MessageForm({ initial, onSave }) {
  const [text, setText] = useState(initial.text || '');
  const [subtext, setSubtext] = useState(initial.subtext || '');
  const [author, setAuthor] = useState(initial.author || '');
  const [scheduledDate, setScheduledDate] = useState(
    initial.scheduled_date ? initial.scheduled_date.slice(0, 10) : ''
  );
  const [isActive, setIsActive] = useState(initial.is_active !== undefined ? initial.is_active : true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      text,
      subtext: subtext || null,
      author: author || null,
      scheduled_date: scheduledDate || null,
      is_active: isActive,
    });
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <h3 className="modal-title">{initial.id ? 'Edit Message' : 'Add Message'}</h3>
      <Field label="Text *"><input value={text} onChange={(e) => setText(e.target.value)} required /></Field>
      <Field label="Subtext"><input value={subtext} onChange={(e) => setSubtext(e.target.value)} /></Field>
      <Field label="Author"><input value={author} onChange={(e) => setAuthor(e.target.value)} /></Field>
      <Field label="Scheduled Date">
        <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
      </Field>
      <Field label="Active">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
      </Field>
      <div className="modal-actions">
        <button type="submit" className="btn btn-primary">
          {initial.id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

function HomeConfigForm({ initial, onSave }) {
  const [heroSubtitle, setHeroSubtitle] = useState(initial.hero_subtitle || '');
  const [footerText, setFooterText] = useState(initial.footer_text || '');
  const [footerIcon, setFooterIcon] = useState(initial.footer_icon || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      hero_subtitle: heroSubtitle || null,
      footer_text: footerText || null,
      footer_icon: footerIcon || null,
    });
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <h3 className="modal-title">Edit Home Configuration</h3>
      <Field label="Hero Subtitle"><input value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} /></Field>
      <Field label="Footer Text"><input value={footerText} onChange={(e) => setFooterText(e.target.value)} /></Field>
      <Field label="Footer Icon"><input value={footerIcon} onChange={(e) => setFooterIcon(e.target.value)} /></Field>
      <div className="modal-actions">
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}