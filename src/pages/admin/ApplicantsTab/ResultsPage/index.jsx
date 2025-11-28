import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ConfimationModal";

import { useMediaQuery } from "./hooks/useMediaQuery"; // Import useMediaQuery directly
import { useResultsData } from "./hooks/useResultsData";
import { useResultsFilters } from "./hooks/useResultsFilters";
import { useResultsPagination } from "./hooks/useResultsPagination";
import { groupDataByExaminee } from "./utils/dataUtils";
import { exportResultsToCSV } from "./utils/exportUtils";

import Header from "./components/Header";
import FiltersPanel from "./components/FiltersPanel";
import Pagination from "./components/Pagination";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import MobileView from "./components/views/MobileView";
import DesktopView from "./components/views/DesktopView";

function ResultsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalPayload, setModalPayload] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { data, allData, isLoading, setData, deleteResult, deleteAllResults } = useResultsData();
  const {
    searchQuery,
    filters,
    uniqueDepartments,
    uniqueQuizzes,
    activeFilterCount,
    handleSearch,
    handleFilterChange,
    clearFilters,
  } = useResultsFilters(allData, setData);

  const {
    currentPage,
    rowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    paginateData,
  } = useResultsPagination();

  const groupedByExaminee = groupDataByExaminee(data);
  const {
    currentItems: currentGroups,
    totalItems: totalGroups,
    totalPages,
    indexOfFirstRow,
    indexOfLastRow,
  } = paginateData(groupedByExaminee);

  const toggleGroupExpansion = (groupKey) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const handleDeleteAttempt = ({ attemptId, email, name }) => {
    setModalPayload({ type: "attempt", attemptId, email, name });
    setShowModal(true);
    setActiveDropdown(null);
  };

  const handleDeleteAllAttempts = ({ email, name }) => {
    setModalPayload({ type: "all", email, name });
    setShowModal(true);
    setActiveDropdown(null);
  };

  const onConfirmDelete = async () => {
    try {
      if (!modalPayload) return;
      setShowModal(false);

      if (modalPayload.type === "attempt") {
        await deleteResult(modalPayload.attemptId);
      } else if (modalPayload.type === "all") {
        await deleteAllResults(modalPayload.email);
      }

      setModalPayload(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete. Please try again.");
      setModalPayload(null);
    }
  };

  const onCancelDelete = () => {
    setModalPayload(null);
    setShowModal(false);
  };

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
    setExpandedGroups(new Set());
    setShowFilters(false);
  };

  const handleExport = () => {
    exportResultsToCSV(data);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      {showModal && modalPayload && (
        <ConfirmationModal
          title={
            modalPayload.type === "attempt"
              ? "Delete result?"
              : "Delete all results?"
          }
          message={
            modalPayload.type === "attempt"
              ? `Delete this result by ${modalPayload.name || modalPayload.email}? This action cannot be undone.`
              : `Delete ALL results for ${modalPayload.name || modalPayload.email}? This action cannot be undone and will permanently remove all test results for this user.`
          }
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onClose={onCancelDelete}
          onConfirm={onConfirmDelete}
          confirmColor="red"
        />
      )}

      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Header 
            totalExaminees={groupedByExaminee.length} 
            totalAttempts={data.length} 
          />

          <FiltersPanel
            searchQuery={searchQuery}
            filters={filters}
            uniqueDepartments={uniqueDepartments}
            uniqueQuizzes={uniqueQuizzes}
            activeFilterCount={activeFilterCount}
            showFilters={showFilters}
            onSearchChange={handleSearch}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onExport={handleExport}
            hasData={data.length > 0}
          />

          {isLoading ? (
            <LoadingState />
          ) : groupedByExaminee.length === 0 ? (
            <EmptyState
              searchQuery={searchQuery}
              activeFilterCount={activeFilterCount}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {isMobile || isTablet ? (
                <MobileView
                  currentGroups={currentGroups}
                  expandedGroups={expandedGroups}
                  onToggleGroup={toggleGroupExpansion}
                  onDeleteAttempt={handleDeleteAttempt}
                  onDeleteAllAttempts={handleDeleteAllAttempts}
                />
              ) : (
                <DesktopView
                  currentGroups={currentGroups}
                  expandedGroups={expandedGroups}
                  onToggleGroup={toggleGroupExpansion}
                  onDeleteAttempt={handleDeleteAttempt}
                />
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalGroups}
                indexOfFirstRow={indexOfFirstRow}
                indexOfLastRow={indexOfLastRow}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ResultsPage;