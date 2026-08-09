import React from 'react';
import { useUploadContent } from '../../hooks/useUploadContent';
import './UploadContentPage.css';

export default function UploadContentPage() {
  const {
    formData,
    setFormData,
    selectedFiles,
    addFiles,
    removeFile,
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleBrowse,
    fileInputRef,
    validationErrors,
    isSubmitting,
    submit,
    submitError,
    submitSuccess,
    setSubmitSuccess,
  } = useUploadContent();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    console.log('Cancel clicked');
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    console.log('Save Draft clicked');
  };

  const handleDismissSuccess = () => setSubmitSuccess(false);

  return (
    <div className="upload-content-page">
      <div className="upload-header">
        <h2>Upload / Edit Content</h2>
        <p className="upload-subtitle">Create new content for your Home</p>
      </div>

      <div className="upload-container">
        {/* ===== SECTION 1: BASIC INFORMATION ===== */}
        <section className="form-section">
          <h3 className="section-title">1. Basic Information</h3>
          <div className="section-content">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="A letter for the days you miss me"
              />
              {validationErrors.title && (
                <span className="error-text">{validationErrors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="excerpt">Subtitle / Excerpt</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="For the moments when you need a hug"
                rows="2"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="room">Room</label>
                <select
                  id="room"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                >
                  <option value="mom">Mom</option>
                  <option value="me">Me</option>
                  <option value="home">Home</option>
                  <option value="memory">Memory</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="contentType">Content Type</label>
                <select
                  id="contentType"
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleChange}
                >
                  <option value="letter">Letter</option>
                  <option value="audio">Audio</option>
                  <option value="photo">Photo</option>
                  <option value="memory">Memory</option>
                  <option value="video">Video</option>
                  <option value="story">Story</option>
                </select>
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
                placeholder="Mom"
              />
              {validationErrors.author && (
                <span className="error-text">{validationErrors.author}</span>
              )}
            </div>
          </div>
        </section>

        {/* ===== SECTION 2: MEDIA & THUMBNAIL ===== */}
        <section className="form-section">
          <h3 className="section-title">2. Media &amp; Thumbnail</h3>
          <div className="section-content">
            <div className="form-group">
              <label>Thumbnail / Audio File *</label>
              <div
                className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="drop-zone-content">
                  <div className="upload-icon">📤</div>
                  <p>Drag &amp; drop files here</p>
                  <p className="drop-hint">or</p>
                  <button
                    type="button"
                    className="browse-btn"
                    onClick={handleBrowse}
                  >
                    Browse Files
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    multiple
                    onChange={(e) => addFiles(e.target.files)}
                  />
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="file-list">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-meta">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                          {file.type.startsWith('audio/') && ' • 05:23'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="remove-file"
                        onClick={() => removeFile(index)}
                        aria-label="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Cover Image (Optional)</label>
                <div className="cover-upload-placeholder">
                  <button type="button" className="browse-btn secondary">
                    Upload image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 3: CONTENT ===== */}
        <section className="form-section">
          <h3 className="section-title">3. Content</h3>
          <div className="section-content">
            <div className="form-group">
              <label htmlFor="excerpt">Description / Transcript</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Whenever you feel lonely or overwhelmed, listen to this..."
                rows="4"
              />
            </div>
          </div>
        </section>

        {/* ===== SECTION 4: SCHEDULING ===== */}
        <section className="form-section">
          <h3 className="section-title">4. Scheduling</h3>
          <div className="section-content">
            <div className="form-row">
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                  />
                  Publish Now
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
            <div className="form-row">
              <div className="form-group">
                <label>Release Date</label>
                <input type="text" placeholder="22 May 2025" disabled />
              </div>
              <div className="form-group">
                <label>Release Time</label>
                <input type="text" placeholder="08:00 AM" disabled />
              </div>
              <div className="form-group">
                <label>Expiry (Optional)</label>
                <input type="text" placeholder="Select date" disabled />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Repeat</label>
                <select disabled>
                  <option>Does not repeat</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select disabled>
                  <option>Normal</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleSaveDraft}>
            Save Draft
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            onClick={submit}
          >
            {isSubmitting ? 'Uploading...' : 'Publish Content'}
          </button>
        </div>

        {submitSuccess && (
          <div className="success-message">
            <p>Content published successfully!</p>
            <button onClick={handleDismissSuccess} className="btn btn-secondary">Dismiss</button>
          </div>
        )}

        {submitError && (
          <div className="error-message">
            <p>Error: {submitError}</p>
          </div>
        )}
      </div>
    </div>
  );
}