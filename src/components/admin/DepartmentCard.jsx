import { Edit2, MoreVertical, Power, Trash2, Building2 } from 'lucide-react';
import React from 'react'

function DepartmentCard({
  dept,
  openMenuId,
  onMenuClicked, 
  onEditClicked, 
  onDeactivateClicked, 
  onDeleteClicked,
  setSelectedDepartment,
}) {

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
        <svg viewBox="0 0 200 120" className="w-full h-18">
          <defs>
            <linearGradient
              id="financeGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#217486" />
              <stop offset="100%" stopColor="#2a8fa5" />
            </linearGradient>
          </defs>
          <rect x="20" y="10" width="160" height="100" fill="#f8fafc" rx="12" />
          <circle
            cx="70"
            cy="55"
            r="28"
            fill="url(#financeGrad)"
            opacity="0.15"
          />
          <circle
            cx="70"
            cy="55"
            r="28"
            fill="none"
            stroke="url(#financeGrad)"
            strokeWidth="3.5"
          />
          <text
            x="70"
            y="66"
            textAnchor="middle"
            fontSize="28"
            fill="#217486"
            fontWeight="bold"
          >
            $
          </text>
          <rect x="115" y="32" width="6" height="28" fill="#10b981" rx="3" />
          <rect x="125" y="40" width="6" height="20" fill="#217486" rx="3" />
          <rect x="135" y="25" width="6" height="35" fill="#f59e0b" rx="3" />
          <rect x="145" y="35" width="6" height="25" fill="#8b5cf6" rx="3" />
        </svg>
      ),
      engineering: (
        <svg viewBox="0 0 200 120" className="w-full h-18">
          <defs>
            <linearGradient id="engGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#217486" />
              <stop offset="100%" stopColor="#1a5d6d" />
            </linearGradient>
          </defs>
          <rect x="20" y="10" width="160" height="100" fill="#f8fafc" rx="12" />
          <rect
            x="45"
            y="25"
            width="70"
            height="75"
            fill="url(#engGrad)"
            rx="6"
            opacity="0.95"
          />
          <rect
            x="52"
            y="33"
            width="56"
            height="10"
            fill="#60a5fa"
            opacity="0.5"
            rx="2"
          />
          <rect
            x="52"
            y="47"
            width="56"
            height="10"
            fill="#60a5fa"
            opacity="0.5"
            rx="2"
          />
          <rect
            x="52"
            y="61"
            width="56"
            height="10"
            fill="#60a5fa"
            opacity="0.5"
            rx="2"
          />
          <text
            x="80"
            y="90"
            textAnchor="middle"
            fontSize="20"
            fill="#e0f2fe"
            fontWeight="bold"
          >
            &lt;/&gt;
          </text>
          <circle cx="140" cy="50" r="18" fill="#10b981" />
          <path
            d="M 132 50 L 137 55 L 148 43"
            stroke="white"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      business: (
        <svg viewBox="0 0 200 120" className="w-full h-18">
          <defs>
            <linearGradient id="bizGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#217486" />
              <stop offset="100%" stopColor="#2a8fa5" />
            </linearGradient>
          </defs>
          <rect x="20" y="10" width="160" height="100" fill="#f8fafc" rx="12" />
          <rect x="40" y="30" width="45" height="65" fill="#e0f2f1" rx="4" />
          <rect x="46" y="38" width="10" height="10" fill="#217486" rx="2" />
          <rect x="60" y="38" width="10" height="10" fill="#217486" rx="2" />
          <rect x="74" y="38" width="10" height="10" fill="#217486" rx="2" />
          <rect x="46" y="52" width="10" height="10" fill="#217486" rx="2" opacity="0.7" />
          <rect x="60" y="52" width="10" height="10" fill="#217486" rx="2" opacity="0.7" />
          <rect x="74" y="52" width="10" height="10" fill="#217486" rx="2" opacity="0.7" />
          <circle cx="120" cy="55" r="24" fill="url(#bizGrad)" opacity="0.2" />
          <circle
            cx="120"
            cy="55"
            r="24"
            fill="none"
            stroke="url(#bizGrad)"
            strokeWidth="3.5"
          />
          <path
            d="M 108 55 L 116 63 L 132 47"
            stroke="#217486"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="155" cy="40" r="16" fill="#fbbf24" opacity="0.9" />
          <path
            d="M 155 32 L 155 40 L 162 45"
            stroke="white"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    };
    return images[type];
  };

  return (
        <div
          onClick={dept.is_active ? setSelectedDepartment : undefined}
          className={`bg-white rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${
            dept.is_active ? "cursor-pointer" : "cursor-default"
          } group ${
            dept.is_active
              ? "border-2 border-gray-100"
              : "border-2 border-gray-200 opacity-50"
          }`}
        >

      {/* Gradient Accent Bar */}
      {/* <div className={`h-1.5 w-full bg-gradient-to-r from-[#217486] to-[#2a8fa5] ${!dept.is_active && 'opacity-50'}`}></div> */}

      <div className="p-5">
        {/* Header with Status and Menu */}
        <div className="flex justify-between items-start mb-4">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              dept.is_active
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${dept.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            {dept.is_active ? "Active" : "Inactive"}
          </span>

          <div className="relative">
            <button
              onClick={onMenuClicked}
              className="text-gray-400 hover:text-[#217486] hover:bg-gray-100 p-2 rounded-lg transition-all"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {openMenuId === dept.dept_id && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={onDeactivateClicked}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors ${
                    dept.is_active
                      ? "text-orange-600 hover:bg-orange-50" 
                      : "text-green-600 hover:bg-green-50"
                  }`}
                >
                  <Power className="w-4 h-4" />
                  <span className="font-medium">{dept.is_active ? "Deactivate" : "Activate"}</span>
                </button>
                <button
                  onClick={onEditClicked}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-[#217486] hover:bg-[#217486]/5 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="font-medium">Edit</span>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={onDeleteClicked}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="font-medium">Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Department Icon */}
        <div className="flex justify-center mb-4 transform group-hover:scale-120 transition-transform duration-300">
          {getImageForType(dept.dept_name)}
        </div>

        {/* Department Name */}
        <div className="text-center ">
          <h3
            className={`text-lg mb-1 ${
              dept.is_active ? "text-[#217486]" : "text-gray-500"
            }`}
          >
            {dept.dept_name}
          </h3>
          <p className="text-xs text-gray-500">Click to manage quizzes</p>
        </div>

        {/* Hover Indicator */}
        <div className={`mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity ${
          dept.is_active ? "text-[#217486]" : "text-gray-400"
        }`}>
          <Building2 className="w-4 h-4" />
          <span className="font-medium">View Department</span>
        </div>
      </div>
    </div>
  )
}

export default DepartmentCard