import React, { useState, useEffect } from "react";
import { Plus, Filter, Search, BookOpen } from "lucide-react";
import QuizManagement from "./QuizManagement";
import {
  addDepartment,
  deleteDepartment,
  editDepartment,
  getAllDepartments,
  toggleDepartmentActiveStatus,
} from "../../../../api/api";
import DepartmentCard from "../../../components/admin/DepartmentCard";
import { filteredDepartments } from "../../../../helpers/helpers";
import SearchAndFilter from "../../../components/admin/SearchAndFilter";
import DeactivateDepartment from "../../../components/admin/modals/DeactivateDepartment";
import DeleteDepartment from "../../../components/admin/modals/DeleteDepartment";
import AddDepartment from "../../../components/admin/modals/AddDepartment";
import EditDepartment from "../../../components/admin/modals/EditDepartment";

const TestBankPage = () => {
  // State
  const [departments, setDepartments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");

  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Form states
  const [newDeptName, setNewDeptName] = useState("");
  const [editingDept, setEditingDept] = useState(null);
  const [deletingDept, setDeletingDept] = useState(null);
  const [deactivateDept, setDeactivateDept] = useState(null);

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await getAllDepartments();
      setDepartments(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(err.response?.data?.message || "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Filtering logic
  useEffect(() => {
    const result = filteredDepartments(departments, searchTerm, filterActive);
    setFiltered(result);
  }, [departments, searchTerm, filterActive]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handlers
  const toggleActiveStatus = async (department) => {
    try {
      await toggleDepartmentActiveStatus(department);
      await fetchDepartments();
      setError(null);
    } catch (err) {
      console.error("Error toggling status:", err);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleAddDepartment = async () => {
    if (!newDeptName.trim()) return;
    try {
      await addDepartment(newDeptName);
      await fetchDepartments();
      closeAllModals();
    } catch (err) {
      console.error("Error creating department:", err);
      setError(err.response?.data?.message || "Failed to create department");
    }
  };

  const handleUpdateDepartment = async () => {
    if (!editingDept?.dept_name.trim()) return;
    try {
      await editDepartment(editingDept);
      await fetchDepartments();
      closeAllModals();
    } catch (err) {
      console.error("Error updating department:", err);
      setError(err.response?.data?.message || "Failed to update department");
    }
  };

  const handleDeleteDepartment = async () => {
    if (!deletingDept) return;
    try {
      await deleteDepartment(deletingDept);
      await fetchDepartments();
      closeAllModals();
    } catch (err) {
      console.error("Error deleting department:", err);
      setError(err.response?.data?.message || "Failed to delete department");
    }
  };

  // Centralized modal close helper
  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowDeactivateModal(false);
    setNewDeptName("");
    setEditingDept(null);
    setDeletingDept(null);
    setDeactivateDept(null);
  };

  // Show Quiz Management if a department is selected
  if (selectedDepartment) {
    return (
      <QuizManagement
        department={selectedDepartment}
        onBack={() => setSelectedDepartment(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-6 mt-20 mb-10 sm:mb-0 sm:mt-0">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold text-[#217486]">Test Bank</h1>
                <p className="text-sm text-gray-600">
                  Manage departments and quizzes
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-[#217486] text-white px-6 py-3 rounded-xl shadow-lg shadow-[#217486]/30 hover:shadow-xl hover:shadow-[#217486]/40 hover:bg-[#1a5d6d] transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              <span className="font-medium">Add Department</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mt-6">
            <SearchAndFilter
              searchTerm={searchTerm}
              filterActive={filterActive}
              onChangeSearchValue={(e) => setSearchTerm(e.target.value)}
              onFilterClicked={(value) => setFilterActive(value)}
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-5 py-4 rounded-xl mb-6 shadow-sm">
            <p className="font-semibold text-sm mb-1">Error Occurred</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-[#217486]/20 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading departments...
              </p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm || filterActive !== "all"
                ? "No departments match your filters"
                : "No departments found"}
            </h3>
            <p className="text-gray-500 mb-6">
              {!searchTerm && filterActive === "all"
                ? "Create your first department to get started"
                : "Try adjusting your search or filter"}
            </p>
            {!searchTerm && filterActive === "all" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#217486] text-white rounded-xl hover:bg-[#1a5d6d] font-medium transition-all shadow-lg shadow-[#217486]/30"
              >
                <Plus className="w-5 h-5" />
                Create First Department
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-[#217486]">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#217486]">
                  {departments.length}
                </span>{" "}
                departments
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((dept) => (
                <DepartmentCard
                  key={dept.dept_id}
                  dept={dept}
                  openMenuId={openMenuId}
                  setSelectedDepartment={() => setSelectedDepartment(dept)}
                  onMenuClicked={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(
                      openMenuId === dept.dept_id ? null : dept.dept_id
                    );
                  }}
                  onEditClicked={(e) => {
                    e.stopPropagation();
                    setEditingDept({ ...dept });
                    setShowEditModal(true);
                    setOpenMenuId(null);
                  }}
                  onDeactivateClicked={(e) => {
                    e.stopPropagation();
                    setDeactivateDept(dept);
                    setShowDeactivateModal(true);
                    setOpenMenuId(null);
                  }}
                  onDeleteClicked={(e) => {
                    e.stopPropagation();
                    setDeletingDept(dept);
                    setShowDeleteModal(true);
                    setOpenMenuId(null);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddDepartment
          newDeptName={newDeptName}
          onChangedDeptName={(e) => setNewDeptName(e.target.value)}
          handleAddDepartment={handleAddDepartment}
          onModalClosed={closeAllModals}
        />
      )}

      {showEditModal && editingDept && (
        <EditDepartment
          editingDept={editingDept}
          onChangedEditingDept={(e) =>
            setEditingDept({ ...editingDept, dept_name: e.target.value })
          }
          handleUpdateDepartment={handleUpdateDepartment}
          onModalClosed={closeAllModals}
        />
      )}

      {showDeleteModal && deletingDept && (
        <DeleteDepartment
          deletingDept={deletingDept}
          handleDeleteDepartment={handleDeleteDepartment}
          onModalClosed={closeAllModals}
        />
      )}

      {showDeactivateModal && deactivateDept && (
        <DeactivateDepartment
          deactivateDept={deactivateDept}
          handleDeactivateClicked={async (e) => {
            e.stopPropagation();
            try {
              await toggleActiveStatus(deactivateDept);
            } finally {
              closeAllModals();
            }
          }}
          onModalClosed={closeAllModals}
        />
      )}
    </div>
  );
};

export default TestBankPage;
