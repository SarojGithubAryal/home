import { useState, useRef, useCallback } from 'react';
import { uploadMedia } from '../services/uploadService';
import { createContent } from '../services/contentService';

// UUID mapping (replace placeholders with actual from DB)
const ROOM_UUIDS = {
  mom: 'a7a83745-9c1f-4748-92a7-fda52bca154d',
  dad: '3a4bfee8-f445-424c-b824-48646e3b78cc',
  me: '5c6110a7-adbc-4c53-b5c6-9f3e23bc23be',
  memory: '68e22340-13eb-43a6-a98e-e369b118b4b6',
};

const CONTENT_TYPE_UUIDS = {
  letter: '40db2614-8e80-4f71-a072-24ecfd1e504a',
  audio: 'audio-uuid-here',      // Replace with actual
  photo: 'photo-uuid-here',      // Replace with actual
  memory: 'memory-uuid-here',    // Replace with actual
  video: 'video-uuid-here',      // Replace with actual
  story: 'story-uuid-here',      // Replace with actual
};

const initialFormData = {
  room: '',          // matches select name
  contentType: '',   // matches select name
  title: '',
  excerpt: '',
  author: '',
  isFeatured: false,
  isPublished: true,
};

export const useUploadContent = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);

  // ----- File management -----
  const addFiles = useCallback((files) => {
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...fileArray]);
      setSubmitError(null);
      setSubmitSuccess(false);
    }
  }, []);

  const removeFile = useCallback((index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setSubmitError(null);
  }, []);

  const handleBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ----- Drag & drop -----
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      addFiles(files);
    }
  }, [addFiles]);

  // ----- Validation -----
  const validate = useCallback(() => {
    const errors = {};
    if (!formData.room) errors.room = 'Room is required';
    if (!formData.contentType) errors.contentType = 'Content type is required';
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.author.trim()) errors.author = 'Author is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // ----- Submit -----
  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);
      setSubmitProgress(0);

      try {
        // 1. Upload all files
        const mediaIds = [];
        for (const file of selectedFiles) {
          const result = await uploadMedia(file);
          if (result.success) {
            mediaIds.push(result.data.media.id);
          } else {
            throw new Error(result.error?.message || 'File upload failed');
          }
          setSubmitProgress(Math.round((mediaIds.length / selectedFiles.length) * 100));
        }

        // 2. Map room and contentType to UUIDs
        const roomId = ROOM_UUIDS[formData.room];
        const contentTypeId = CONTENT_TYPE_UUIDS[formData.contentType];

        if (!roomId || !contentTypeId) {
          throw new Error('Invalid room or content type selection');
        }

        // 3. Build payload
        const payload = {
          room_id: roomId,
          content_type_id: contentTypeId,
          title: formData.title.trim(),
          author: formData.author.trim(),
          is_published: formData.isPublished,
          is_featured: formData.isFeatured,
          mediaIds,
          excerpt: formData.excerpt?.trim() || null,
        };

        // 4. Create content
        const result = await createContent(payload);
        if (!result.success) {
          throw new Error(result.error?.message || 'Content creation failed');
        }

        setSubmitSuccess(true);
        // Optionally reset form after success
        // setFormData(initialFormData);
        // setSelectedFiles([]);
      } catch (err) {
        setSubmitError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, selectedFiles, validate]
  );

  // ----- Return -----
  return {
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
    submitProgress,
  };
};