import { useState, useMemo, useCallback } from "react";

const INITIAL_FILTERS = {
  department: "",
  status: "",
  quiz: "",
  dateFrom: "",
  dateTo: "",
};

export const useResultsFilters = (allData, setData) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const uniqueDepartments = useMemo(
    () => [...new Set(allData.map((item) => item.department).filter(Boolean))],
    [allData]
  );

  const uniqueQuizzes = useMemo(
    () => [...new Set(allData.map((item) => item.quiz_name).filter(Boolean))],
    [allData]
  );

  const activeFilterCount = useMemo(
    () =>
      Object.values(filters).filter((v) => v).length + (searchQuery ? 1 : 0),
    [filters, searchQuery]
  );

  const applyFilters = useCallback(
    (newFilters, searchTerm = searchQuery) => {
      let filtered = [...allData];

      // Apply search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter((item) =>
          Object.values(item).some(
            (value) =>
              value && value.toString().toLowerCase().includes(searchLower)
          )
        );
      }

      // Apply department filter
      if (newFilters.department) {
        filtered = filtered.filter(
          (item) => item.department === newFilters.department
        );
      }

      // Apply status filter
      if (newFilters.status) {
        filtered = filtered.filter((item) => item.status === newFilters.status);
      }

      // Apply quiz filter
      if (newFilters.quiz) {
        filtered = filtered.filter(
          (item) => item.quiz_name === newFilters.quiz
        );
      }

      // Apply date range filters
      if (newFilters.dateFrom) {
        const fromDate = new Date(newFilters.dateFrom);
        filtered = filtered.filter((item) => new Date(item.date) >= fromDate);
      }

      if (newFilters.dateTo) {
        const toDate = new Date(newFilters.dateTo);
        filtered = filtered.filter((item) => new Date(item.date) <= toDate);
      }

      setData(filtered);
    },
    [allData, searchQuery, setData]
  );

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      applyFilters(filters, query);
    },
    [filters, applyFilters]
  );

  const handleFilterChange = useCallback(
    (key, value) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      applyFilters(newFilters);
    },
    [filters, applyFilters]
  );

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery("");
    setData(allData);
  }, [allData, setData]);

  return {
    searchQuery,
    filters,
    uniqueDepartments,
    uniqueQuizzes,
    activeFilterCount,
    handleSearch,
    handleFilterChange,
    clearFilters,
    applyFilters,
  };
};