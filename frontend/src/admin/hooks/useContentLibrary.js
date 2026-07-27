import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useUrlFilters } from './useUrlFilters';
import { fetchContent } from '../services/contentService';

const DEFAULT_FILTERS = {
  page: 1,
  limit: 10,
  search: '',
  type: null,
  room: null,
  mood: null,
  status: null,
  sort: 'created_at',
  order: 'desc',
};

export function useContentLibrary() {
  const [filters, setFilters] = useUrlFilters(DEFAULT_FILTERS);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [availableFilters, setAvailableFilters] = useState({
    availableRooms: [],
    availableMoods: [],
    availableTypes: [],
    availableStatuses: [],
  });
  const [loading, setLoading] = useState(true);        // initial load
  const [fetching, setFetching] = useState(false);     // subsequent fetches
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debounceTimer = useRef(null);
  const abortControllerRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      // When debounced search changes, reset page and apply the new search
      setFilters((prev) => ({
        ...prev,
        search: searchInput,
        page: 1,
      }));
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchInput, setFilters]);

  // Fetch data whenever filters change
  const loadData = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Determine if this is the first load (show full loading) or a refetch (keep items visible)
    const isFirstLoad = items.length === 0 && loading;
    if (!isFirstLoad) setFetching(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await fetchContent({ ...filters, signal: controller.signal });
      setItems(data.items ?? []);
      setPagination(data.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 });
      // Update available filter options from backend
      if (data.filters) {
        setAvailableFilters({
          availableRooms: data.filters.availableRooms ?? [],
          availableMoods: data.filters.availableMoods ?? [],
          availableTypes: data.filters.availableTypes ?? [],
          availableStatuses: data.filters.availableStatuses ?? [],
        });
      }
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      // Keep previous items visible on error
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [filters, items.length, loading]);

  useEffect(() => {
    loadData();
    return () => abortControllerRef.current?.abort();
  }, [loadData]);

  // Update a single filter (resets page unless it's page itself)
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && key !== 'limit' && { page: 1 }),
    }));
  }, [setFilters]);

  // Set multiple filters at once (used for reset)
  const setMultipleFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      ...newFilters,
      page: 1, // always reset page when clearing
    }));
    setSearchInput('');
  }, [setFilters]);

  // Reset all filters to defaults
  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
  }, [setFilters]);

  // Refetch with current filters (used by Refresh button)
  const refetch = useCallback(() => {
    loadData();
  }, [loadData]);

  const isFiltered = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.type !== null ||
      filters.room !== null ||
      filters.mood !== null ||
      filters.status !== null
    );
  }, [filters]);

  return {
    items,
    pagination,
    loading,
    fetching,
    error,
    filters,
    availableFilters,
    searchInput,
    setSearchInput,
    updateFilter,
    setMultipleFilters,
    clearAllFilters,
    refetch,
    isFiltered,
  };
}