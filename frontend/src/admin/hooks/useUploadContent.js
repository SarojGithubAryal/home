import { useState, useRef, useCallback } from 'react';
import { uploadMedia, createContent } from '../services/uploadService';
import { ROOMS, CONTENT_TYPES } from '../constants/uploadConstants';

const initialFormData = {
  contentType: 'letter',
  room: 'mom',
  title: '',
  excerpt: '',
  author: '',
  isFeatured: false,
  isPublished: false,
};

export const useUploadContent = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);

  const addFiles = useCallback((files) => {
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...fileArray]);
    }
  }, []);

  const removeFile = useCallback((index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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

  const validate = useCallback(() => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.author.trim()) errors.author = 'Author is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        // 1. Upload all selected files and collect media IDs
        const mediaIds = [];
        for (const file of selectedFiles) {
          const media = await uploadMedia(file);
          mediaIds.push(media.id);
        }

        // 2. Build the content payload with real UUIDs
        const roomId = ROOMS[formData.room];
        const contentTypeId = CONTENT_TYPES[formData.contentType];

        if (!roomId || !contentTypeId) {
          throw new Error('Invalid room or content type selected.');
        }

        const payload = {
          room_id: roomId,
          content_type_id: contentTypeId,
          title: formData.title,
          body: formData.excerpt,  // the form's "excerpt" doubles as body for letters
          excerpt: formData.excerpt,
          author: formData.author,
          is_published: formData.isPublished,
          is_featured: formData.isFeatured,
          mediaIds,
        };

        await createContent(payload);

        setSubmitSuccess(true);
        // Optionally reset the form here
      } catch (err) {
        setSubmitError(err.message || 'Something went wrong');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, selectedFiles, validate]
  );

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
    setSubmitSuccess,   // allow the page to clear success message
    setSubmitError,
  };
};