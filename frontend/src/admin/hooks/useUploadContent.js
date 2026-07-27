import { useState, useRef, useCallback } from 'react';

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
  const [uploadNotImplemented, setUploadNotImplemented] = useState(false);
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

      // Simulate submission – backend not implemented
      setIsSubmitting(true);
      setUploadNotImplemented(false);

      // Simulate async delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Show the "not implemented" state
      setUploadNotImplemented(true);
      setIsSubmitting(false);
    },
    [validate]
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
    uploadNotImplemented,
  };
};