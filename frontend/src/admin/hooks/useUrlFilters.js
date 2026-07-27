import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useUrlFilters
 *
 * Synchronises an object of filters with the URL's search params.
 * On mount, reads initial values from window.location.search.
 * On change, pushes new params to history.
 */

function getFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  const filters = {};

  if (params.has('page')) filters.page = Number(params.get('page')) || 1;
  if (params.has('limit')) filters.limit = Number(params.get('limit')) || 10;
  if (params.has('search')) filters.search = params.get('search');
  if (params.has('type')) filters.type = params.get('type');
  if (params.has('room')) filters.room = params.get('room');
  if (params.has('mood')) filters.mood = params.get('mood');
  if (params.has('status')) filters.status = params.get('status');
  if (params.has('sort')) filters.sort = params.get('sort');
  if (params.has('order')) filters.order = params.get('order');

  return filters;
}

function pushFiltersToURL(filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, value);
    }
  });

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  if (newUrl !== `${window.location.pathname}${window.location.search}`) {
    window.history.pushState({}, '', newUrl);
  }
}

export function useUrlFilters(defaultFilters = {}) {
  const [filters, setFiltersState] = useState(() => ({
    ...defaultFilters,
    ...getFiltersFromURL(),
  }));

  const isInitialMount = useRef(true);

  // Listen to popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setFiltersState((prev) => ({
        ...prev,
        ...getFiltersFromURL(),
      }));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Push filters to URL whenever they change (skip first mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    pushFiltersToURL(filters);
  }, [filters]);

  const setFilters = useCallback((newFilters) => {
    setFiltersState((prev) => ({
      ...prev,
      ...(typeof newFilters === 'function' ? newFilters(prev) : newFilters),
    }));
  }, []);

  return [filters, setFilters];
}