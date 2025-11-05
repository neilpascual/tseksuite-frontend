import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  MoreVertical,
  Trash2,
  Edit2,
  Power,
  Search,
  Filter,
} from "lucide-react";
import QuizManagement from "./QuizManagement";

const TestBankPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [editingDept, setEditingDept] = useState(null);
  const [deletingDept, setDeletingDept] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const API_BASE_URL = "http://localhost:3000/api/department";

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/get`);
      
      setDepartments(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch departments");
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (dept) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/toggle-status/${dept.dept_id}`,
        {
          is_active: !dept.is_active,
        }
      );

      await fetchDepartments();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
      console.error("Error toggling status:", err);
    }
  };

  const getImageForType = (name) => {
    const lowerName = name.toLowerCase();
    let type = "business";

    if (lowerName.includes("finance") || lowerName.includes("accounting")) {
      type = "finance";
    } else if (
      lowerName.includes("engineer") ||
      lowerName.includes("tech") ||
      lowerName.includes("it")
    ) {
      type = "engineering";
    }

    const images = {
      finance: (
        <svg viewBox="0 0 200 120" className="w-full h-24 lg:h-32">
          <defs>
            <linearGradient
              id="financeGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <rect x="20" y="10" width="160" height="100" fill="#fafafa" rx="8" />
          <circle
            cx="70"
            cy="55"
            r="24"
            fill="url(#financeGrad)"
            opacity="0.2"
          />
          <circle
            cx="70"
            cy="55"
            r="24"
            fill="none"
            stroke="url(#financeGrad)"
            strokeWidth="3"
          />
          <text
            x="70"
            y="63"
            textAnchor="middle"
            fontSize="24"
            fill="#6366f1"
            fontWeight="bold"
          >
            $
          </text>
          <rect x="120" y="35" width="4" height="25" fill="#10b981" rx="2" />
          <rect x="128" y="42" width="4" height="18" fill="#3b82f6" rx="2" />
          <rect x="136" y="28" width="4" height="32" fill="#f59e0b" rx="2" />
          <rect x="144" y="38" width="4" height="22" fill="#8b5cf6" rx="2" />
        </svg>
      ),
      engineering: (
        <svg viewBox="0 0 200 120" className="w-full h-24 lg:h-32">
          <defs>
            <linearGradient id="engGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
          </defs>
          <rect x="20" y="10" width="160" height="100" fill="#fafafa" rx="8" />
          <rect
            x="50"
            y="30"
            width="60"
            height="70"
            fill="url(#engGrad)"
            rx="4"
            opacity="0.9"
          />
          <rect
            x="55"
            y="36"
            width="50"
            height="8"
            fill="#60a5fa"
            opacity="0.6"
          />
          <rect
            x="55"
            y="48"
            width="50"
            height="8"
            fill="#60a5fa"
            opacity="0.6"
          />
          <rect
            x="55"
            y="60"
            width="50"
            height="8"
            fill="#60a5fa"
            opacity="0.6"
          />
          <text
            x="80"
            y="86"
            textAnchor="middle"
            fontSize="18"
            fill="#e0f2fe"
            fontWeight="bold"
          >
            &lt;/&gt;
          </text>
          <circle cx="135" cy="45" r="15" fill="#10b981" />
          <path
            d="M 128 45 L 133 50 L 142 40"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      ),
      business: (
        <svg viewBox="0 0 200 120" className="w-full h-24 lg:h-32">
          <defs>
            <linearGradient id="bizGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>
          <rect x="20" y="10" width="160" height="100" fill="#fafafa" rx="8" />
          <rect x="45" y="35" width="40" height="60" fill="#dbeafe" rx="3" />
          <rect x="50" y="42" width="8" height="8" fill="#3b82f6" rx="1" />
          <rect x="62" y="42" width="8" height="8" fill="#3b82f6" rx="1" />
          <rect x="74" y="42" width="8" height="8" fill="#3b82f6" rx="1" />
          <circle cx="115" cy="55" r="20" fill="url(#bizGrad)" opacity="0.2" />
          <circle
            cx="115"
            cy="55"
            r="20"
            fill="none"
            stroke="url(#bizGrad)"
            strokeWidth="3"
          />
          <path
            d="M 105 55 L 112 62 L 125 48"
            stroke="#06b6d4"
            strokeWidth="2.5"
            fill="none"
          />
          <circle cx="150" cy="42" r="14" fill="#fbbf24" opacity="0.9" />
          <path
            d="M 150 35 L 150 42 L 156 46"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      ),
    };
    return images[type];
  };

  const handleAddDepartment = async () => {
    if (!newDeptName.trim()) return;

    try {
      await axios.post(`${API_BASE_URL}/create`, {
        dept_name: newDeptName,
        is_active: true,
      });

      await fetchDepartments();
      setNewDeptName("");
      setShowAddModal(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create department");
      console.error("Error creating department:", err);
    }
  };

  const handleUpdateDepartment = async () => {
    if (!editingDept || !editingDept.dept_name.trim()) return;

    try {
      await axios.put(
        `${API_BASE_URL}/update/${editingDept.dept_id}`,
        {
          dept_name: editingDept.dept_name,
        }
      );

      await fetchDepartments();
      setShowEditModal(false);
      setEditingDept(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update department");
      console.error("Error updating department:", err);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!deletingDept) return;

    try {
      await axios.delete(`${API_BASE_URL}/delete/${deletingDept.dept_id}`);

      await fetchDepartments();
      setShowDeleteModal(false);
      setDeletingDept(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete department");
      console.error("Error deleting department:", err);
    }
  };

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch = dept.dept_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && dept.is_active) ||
      (filterActive === "inactive" && !dept.is_active);
    return matchesSearch && matchesFilter;
  });

  // If a department is selected, show the quiz management page
  if (selectedDepartment) {
    return (
      <QuizManagement
        department={selectedDepartment}
        onBack={() => setSelectedDepartment(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-4xl font-bold bg-cyan-600 bg-clip-text text-transparent mb-2">
                Department Management
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Manage test bank departments and their status
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-cyan-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="text-sm lg:text-base">Add Department</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-xl p-3 lg:p-4 shadow-sm border border-gray-100">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm lg:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterActive("all")}
                className={`px-3 lg:px-4 py-2 text-sm lg:text-base rounded-lg font-medium transition-all ${
                  filterActive === "all"
                    ? "bg-cyan-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterActive("active")}
                className={`px-3 lg:px-4 py-2 text-sm lg:text-base rounded-lg font-medium transition-all ${
                  filterActive === "active"
                    ? "bg-green-700 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterActive("inactive")}
                className={`px-3 lg:px-4 py-2 text-sm lg:text-base rounded-lg font-medium transition-all ${
                  filterActive === "inactive"
                    ? "bg-gray-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
            <p className="font-medium text-sm lg:text-base">Error</p>
            <p className="text-xs lg:text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-48 lg:h-64">
            <div className="relative">
              <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="text-center py-12 lg:py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-base lg:text-lg">
              {searchTerm || filterActive !== "all"
                ? "No departments match your filters"
                : "No departments found"}
            </p>
            <p className="text-gray-400 text-xs lg:text-sm mt-1">
              {!searchTerm &&
                filterActive === "all" &&
                "Create your first department to get started"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {filteredDepartments.map((dept) => (
              <div
                key={dept.dept_id}
                onClick={() => setSelectedDepartment(dept)}
                className={`bg-white rounded-2xl border-2 p-4 lg:p-6 transition-all duration-300 hover:shadow-lg lg:hover:shadow-xl hover:-translate-y-0.5 lg:hover:-translate-y-1 relative overflow-hidden cursor-pointer ${
                  dept.is_active
                    ? "border-cyan-500"
                    : "border-gray-200 opacity-75"
                }`}
              >
                {/* Active Status Indicator */}
                <div
                  className={`absolute top-0 right-0 w-16 h-16 lg:w-20 lg:h-20 ${
                    dept.is_active
                      ? "bg-cyan-500"
                      : "bg-gradient-to-br from-gray-300 to-gray-400"
                  } rounded-bl-full opacity-20`}
                ></div>

                {/* Menu Button */}
                <div className="absolute top-3 right-3 lg:top-4 lg:right-4 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(
                        openMenuId === dept.dept_id ? null : dept.dept_id
                      );
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1 lg:p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openMenuId === dept.dept_id && (
                    <div className="absolute right-0 mt-1 lg:mt-2 w-44 lg:w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleActiveStatus(dept);
                          setOpenMenuId(null);
                        }}
                        className={`flex items-center gap-3 w-full px-3 lg:px-4 py-2 text-sm text-left transition-colors ${
                          dept.is_active
                            ? "text-orange-600 hover:bg-orange-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                      >
                        <Power size={16} />
                        {dept.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingDept({ ...dept });
                          setShowEditModal(true);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-3 w-full px-3 lg:px-4 py-2 text-sm text-left text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingDept(dept);
                          setShowDeleteModal(true);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-3 w-full px-3 lg:px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex justify-start mb-3">
                  <span
                    className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${
                      dept.is_active
                        ? "bg-green-100 text-cyan-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {dept.is_active ? "● Active" : "○ Inactive"}
                  </span>
                </div>

                {/* Department Icon */}
                <div className="flex justify-center mb-3 lg:mb-4 opacity-90">
                  {getImageForType(dept.dept_name)}
                </div>

                {/* Department Name */}
                <h3
                  className={`text-base lg:text-lg font-semibold text-center ${
                    dept.is_active ? "text-gray-800" : "text-gray-500"
                  }`}
                >
                  {dept.dept_name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 lg:p-8 max-w-md w-full mx-4 shadow-2xl transform animate-in zoom-in-95 duration-200">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
              Add New Department
            </h2>
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              placeholder="Enter department name"
              className="w-full px-4 py-3 text-sm lg:text-base border-2 border-gray-200 rounded-xl mb-4 lg:mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              onKeyPress={(e) => e.key === "Enter" && handleAddDepartment()}
              autoFocus
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewDeptName("");
                }}
                className="flex-1 px-4 py-3 text-sm lg:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDepartment}
                disabled={!newDeptName.trim()}
                className="flex-1 px-4 py-3 text-sm lg:text-base bg-cyan-700 hover:to-blue-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingDept && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 lg:p-8 max-w-md w-full mx-4 shadow-2xl transform animate-in zoom-in-95 duration-200">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
              Edit Department
            </h2>
            <input
              type="text"
              value={editingDept.dept_name}
              onChange={(e) =>
                setEditingDept({ ...editingDept, dept_name: e.target.value })
              }
              placeholder="Department name"
              className="w-full px-4 py-3 text-sm lg:text-base border-2 border-gray-200 rounded-xl mb-4 lg:mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              onKeyPress={(e) => e.key === "Enter" && handleUpdateDepartment()}
              autoFocus
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingDept(null);
                }}
                className="flex-1 px-4 py-3 text-sm lg:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDepartment}
                disabled={!editingDept.dept_name.trim()}
                className="flex-1 px-4 py-3 text-sm lg:text-base bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingDept && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 lg:p-8 max-w-md w-full mx-4 shadow-2xl transform animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 text-center">
              Delete Department
            </h2>
            <p className="text-gray-600 text-sm lg:text-base mb-4 lg:mb-6 text-center">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">
                {deletingDept.dept_name}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingDept(null);
                }}
                className="flex-1 px-4 py-3 text-sm lg:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDepartment}
                className="flex-1 px-4 py-3 text-sm lg:text-base bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestBankPage;