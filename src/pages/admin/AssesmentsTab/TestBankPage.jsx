import React, { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
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
    <div className="h-screen w-full px-3 sm:px-6 md:px-8 py-6 mt-20 mb-10  sm:mb-0 sm:mt-0">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <h1 className="text-[#2E99B0] text-md md:text-xl lg:text-2xl xl:text-3xl">
            Departments
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-cyan-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="text-sm lg:text-base">Add Department</span>
          </button>
        </div>

        <SearchAndFilter
          searchTerm={searchTerm}
          filterActive={filterActive}
          onChangeSearchValue={(e) => setSearchTerm(e.target.value)}
          onFilterClicked={(value) => setFilterActive(value)}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
          <p className="font-medium text-sm lg:text-base">Error</p>
          <p className="text-xs lg:text-sm">{error}</p>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-48 lg:h-64">
          <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 lg:py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter size={24} className="text-gray-400" />
          </div>
          <div className="text-gray-500 text-base lg:text-lg ">
            {searchTerm || filterActive !== "all"
              ? "No departments match your filters"
              : "No departments found"}
          </div>
          <p className="text-gray-400 text-xs lg:text-sm mt-1">
            {!searchTerm &&
              filterActive === "all" &&
              "Create your first department to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5  ">
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
      )}

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
