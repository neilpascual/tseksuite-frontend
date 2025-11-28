import { useState, useMemo } from "react";

export const useFilters = (rawData, filteredRawData, setFilteredRawData) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    dateFrom: "",
    dateTo: "",
  });

  const uniqueDepartments = useMemo(() => [
    ...new Set(
      rawData.map((item) => item.department).filter((dept) => dept && dept !== "N/A")
    ),
  ], [rawData]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0);

  const applyFilters = (newFilters = filters, searchTerm = searchQuery) => {
    let filtered = [...rawData];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((row) =>
        [
          row.examiner_name,
          row.name,
          row.email,
          row.department,
          row.date,
          row.time,
          row.created_at,
        ]
          .filter(Boolean)
          .some((v) => v.toString().toLowerCase().includes(q))
      );
    }

    if (newFilters.department) {
      filtered = filtered.filter((row) => row.department === newFilters.department);
    }

    if (newFilters.dateFrom) {
      const from = new Date(newFilters.dateFrom);
      from.setHours(0, 0, 0, 0);
      filtered = filtered.filter((row) => {
        const val = row.created_at || row.date;
        if (!val) return false;
        const d = new Date(val);
        return d >= from;
      });
    }

    if (newFilters.dateTo) {
      const to = new Date(newFilters.dateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((row) => {
        const val = row.created_at || row.date;
        if (!val) return false;
        const d = new Date(val);
        return d <= to;
      });
    }

    setFilteredRawData(filtered);
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    applyFilters(filters, q);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters, searchQuery);
  };

  const clearFilters = () => {
    const cleared = { department: "", dateFrom: "", dateTo: "" };
    setFilters(cleared);
    setSearchQuery("");
    setFilteredRawData(rawData);
  };

  return {
    searchQuery,
    filters,
    uniqueDepartments,
    activeFilterCount,
    handleSearch,
    handleFilterChange,
    clearFilters,
    applyFilters,
  };
};