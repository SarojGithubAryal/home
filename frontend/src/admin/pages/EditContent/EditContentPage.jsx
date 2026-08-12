import React, { useState, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { updateContent } from '../../services/contentService';
import ADMIN_PAGES from '../../navigation/adminPages';
import './EditContentPage.css';

// UUID mapping (same as in useUploadContent)
const ROOM_UUIDS = {
  mom: 'a7a83745-9c1f-4748-92a7-fda52bca154d',
  dad: '3a4bfee8-f445-424c-b824-48646e3b78cc',
  me: '5c6110a7-adbc-4c53-b5c6-9f3e23bc23be',
  memory: '68e22340-13eb-43a6-a98e-e369b118b4b6',
};

const CONTENT_TYPE_UUIDS = {
  letter: '40db2614-8e80-4f71-a072-24ecfd1e504a',
  audio: 'audio-uuid-here',
  photo: 'photo-uuid-here',
  memory: 'memory-uuid-here',
  video: 'video-uuid-here',
  story: 'story-uuid-here',
};

// Reverse lookup for display
const ROOM_NAMES = Object.fromEntries(Object.entries(ROOM_UUIDS).map(([k, v]) => [v, k]));
const CONTENT_TYPE_NAMES = Object.fromEntries(Object.entries(CONTENT_TYPE_UUIDS).map(([k, v]) => [v, k]));

export default function EditContentPage({ contentId, onNavigate }) {
  const { data, loading, error: fetchError, refetch } = useContent(contentId);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    author: '',
    isPublished: true,
    isFeatured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (data?.content) {
      const content = data.content;
      const room = ROOM_NAMES[content.room_id] || '';
      const contentType = CONTENT_TYPE_NAMES[content.content_type_id] || '';
      setFormData({
        room,
        contentType,
        title: content.title || '',
        excerpt: content.excerpt || '',
        author: content.author || '',
        isPublished: content.is_published ?? true,
        isFeatured: content.is_featured ?? false,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const payload = {
        title: formData.title.trim(),
        excerpt: formData.excerpt?.trim() || null,
        author: formData.author.trim(),
        is_published: formData.isPublished,
        is_featured: formData.isFeatured,
      };

      const result = await updateContent(contentId, payload);
      if (!result.success) {
        throw new Error(result.error?.message || 'Update failed');
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        if (onNavigate) onNavigate(ADMIN_PAGES.CONTENT_LIBRARY);
      }, 1500);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onNavigate) onNavigate(ADMIN_PAGES.CONTENT_LIBRARY);
  };

  if (loading) return <div className="admin-placeholder">Loading content…</div>;
  if (fetchError) return <div className="admin-placeholder">Error loading content.</div>;

  return (
    <div className="edit-content-page">
      <div className="edit-header">
        <h2>Edit Content</h2>
        <button className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </div>

      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt / Subtitle</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="2"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="room">Room</label>
            <select id="room" name="room" value={formData.room} disabled>
              <option value="">{formData.room || 'Select'}</option>
            </select>
            <small>Room cannot be changed via edit.</small>
          </div>
          <div className="form-group">
            <label htmlFor="contentType">Content Type</label>
            <select id="contentType" name="contentType" value={formData.contentType} disabled>
              <option value="">{formData.contentType || 'Select'}</option>
            </select>
            <small>Content type cannot be changed via edit.</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
              />
              Published
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              Featured
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {submitError && <div className="error-message">{submitError}</div>}
        {submitSuccess && <div className="success-message">Content updated successfully!</div>}
      </form>
    </div>
  );
}