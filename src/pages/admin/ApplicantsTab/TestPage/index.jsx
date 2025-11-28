import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ConfimationModal";

import { useMediaQuery } from "./hooks/useMediaQuery";
import { useTestsData } from "./hooks/useTestsData";
import { useFilters } from "./hooks/useFilters";
import { groupDataByExaminee, paginateData } from "./utils/dataUtils";
import { exportToCSV } from "./utils/exportUtils";

import Header from "./components/Header";
import FiltersPanel from "./components/FiltersPanel";
import Pagination from "./components/Pagination";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import MobileView from "./components/views/MobileView";
import TabletView from "./components/views/TableView";
import DesktopView from "./components/views/DesktopView";

function TestsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalPayload, setModalPayload] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { rawData, filteredRawData, isDataLoading, setFilteredRawData, deleteAttempt } = useTestsData();
  
  const {
    searchQuery,
    filters,
    uniqueDepartments,
    activeFilterCount,
    handleSearch,
    handleFilterChange,
    clearFilters,
  } = useFilters(rawData, filteredRawData, setFilteredRawData);

  const groupedByExaminee = groupDataByExaminee(filteredRawData);
  const {
    currentItems: currentGroups,
    totalItems: totalGroups,
    totalPages,
    indexOfFirstRow,
    indexOfLastRow,
  } = paginateData(groupedByExaminee, currentPage, rowsPerPage);

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
        await deleteAttempt(modalPayload.attemptId);
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

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
    setExpandedGroups(new Set());
    setShowFilters(false);
  };

  const handleExport = () => {
    exportToCSV(filteredRawData);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {showModal && modalPayload && (
        <ConfirmationModal
          title={modalPayload.type === "attempt" ? "Delete attempt?" : "Delete all attempts?"}
          message={
            modalPayload.type === "attempt"
              ? `Delete this attempt by ${modalPayload.name || modalPayload.email}? This action cannot be undone.`
              : `Delete ALL attempts for ${modalPayload.name || modalPayload.email}? This action cannot be undone and will permanently remove all examination data for this user.`
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
            totalAttempts={rawData.length} 
          />

          <FiltersPanel
            searchQuery={searchQuery}
            filters={filters}
            uniqueDepartments={uniqueDepartments}
            activeFilterCount={activeFilterCount}
            showFilters={showFilters}
            onSearchChange={handleSearch}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onExport={handleExport}
            hasData={filteredRawData.length > 0}
          />

          {isDataLoading ? (
            <LoadingState />
          ) : groupedByExaminee.length === 0 ? (
            <EmptyState
              searchQuery={searchQuery}
              activeFilterCount={activeFilterCount}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {isMobile ? (
                <MobileView
                  currentGroups={currentGroups}
                  expandedGroups={expandedGroups}
                  onToggleGroup={toggleGroupExpansion}
                  onDeleteAttempt={handleDeleteAttempt}
                  onDeleteAllAttempts={handleDeleteAllAttempts}
                />
              ) : isTablet ? (
                <TableView
                  currentGroups={currentGroups}
                  expandedGroups={expandedGroups}
                  onToggleGroup={toggleGroupExpansion}
                  onDeleteAttempt={handleDeleteAttempt}
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

export default TestsPage;