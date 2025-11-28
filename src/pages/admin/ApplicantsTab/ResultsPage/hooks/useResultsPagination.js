import { useState, useCallback } from "react";

export const useResultsPagination = (initialRowsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const paginateData = (data) => {
    const totalItems = data.length;
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentItems = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

    return {
      currentItems,
      totalItems,
      totalPages,
      indexOfFirstRow,
      indexOfLastRow,
    };
  };

  return {
    currentPage,
    rowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    paginateData,
  };
};