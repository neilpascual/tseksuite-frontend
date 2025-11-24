import React, { useState, useEffect } from "react";
import { Building, Plus, Search, Filter, Download, X } from "lucide-react";
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
import toast from "react-hot-toast";

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
  // const [disabled, setDisabled] = useState(false);

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
      //added toast!
      toast.success("Department Status Updated!");
      setError(null);
    } catch (err) {
      console.error("Error toggling status:", err);
      setError(err.response?.data?.message || "Failed to update status");
      toast.error("Department Update Status Failed");
    }
  };

  const handleAddDepartment = async () => {
    if (!newDeptName.trim()) return;
    try {
      await addDepartment(newDeptName);
      await fetchDepartments();
      //added toast
      toast.success("Department Added!");
      closeAllModals();
    } catch (err) {
      console.error("Error creating department:", err);
      setError(err.response?.data?.message || "Failed to create department");
      toast.error("Department Creation Failed!");
    }
  };

  const handleUpdateDepartment = async () => {
    if (!editingDept?.dept_name.trim()) return;
    try {
      await editDepartment(editingDept);
      await fetchDepartments();
      //added toast
      toast.success("Department Updated!");
      closeAllModals();
    } catch (err) {
      console.error("Error updating department:", err);
      setError(err.response?.data?.message || "Failed to update department");
      toast.error("De[artment Update Failed!");
    }
  };

  const handleDeleteDepartment = async () => {
    if (!deletingDept) return;
    try {
      await deleteDepartment(deletingDept);
      await fetchDepartments();
      toast.success("Department Deleted Successfully!");
      closeAllModals();
    } catch (err) {
      console.error("Error deleting department:", err);
      setError(err.response?.data?.message || "Failed to delete department");
      toast.error("Department Deletion Failed!");
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
    <div className="min-h-screen bg-white px-6 py-6 mb-17 sm:mb-0 sm:mt-0">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div>
                <h1 className="text-3xl bg-cyan-700 bg-clip-text text-transparent mb-2">
                  Departments
                </h1>
                <p className="text-gray-600 text-sm font-small">
                  Manage departments and their assessments.
                </p>
              </div>
            </div>

            {/* Add Department Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="group relative flex items-center justify-center gap-3 bg-cyan-700 text-white px-6 py-4 rounded-2xl shadow-lg shadow-[#217486]/25 hover:shadow-xl hover:shadow-[#217486]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-semibold min-w-[180px]"
            >
              <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <Plus
                className="w-5 h-5 transition-transform group-hover:scale-110"
                strokeWidth={2.5}
              />
              <span className="relative">Add Department</span>
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-200/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search departments"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#217486]/20 focus:border-[#217486] transition-all duration-200 placeholder-gray-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-300 p-1">
                  <button
                    onClick={() => setFilterActive("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filterActive === "all"
                        ? "bg-[#217486] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterActive("active")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filterActive === "active"
                        ? "bg-[#217486] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilterActive("inactive")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filterActive === "inactive"
                        ? "bg-[#217486] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || filterActive !== "all") && (
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="text-sm text-gray-500">Active filters:</span>
                {searchTerm && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {filterActive !== "all" && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Status: {filterActive}
                    <button
                      onClick={() => setFilterActive("all")}
                      className="ml-1 hover:text-green-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterActive("all");
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              </div>
            )}
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
                    // setDisabled(true)
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
