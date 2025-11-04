import React, { useState } from 'react';
import { Plus, MoreVertical } from 'lucide-react';

const TestBankPage = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Finance', image: 'finance' },
    { id: 2, name: 'Engineering', image: 'engineering' },
    { id: 3, name: 'Business Ops', image: 'business' },
    { id: 4, name: 'Finance', image: 'finance' },
    { id: 5, name: 'Engineering', image: 'engineering' },
    { id: 6, name: 'Business Ops', image: 'business' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');

  const getImageForType = (type) => {
    const images = {
      finance: (
        <svg viewBox="0 0 200 150" className="w-full h-32">
          <rect x="20" y="20" width="160" height="110" fill="#f0f4f8" rx="8"/>
          <circle cx="80" cy="75" r="25" fill="#e0e7ff" stroke="#6366f1" strokeWidth="3"/>
          <text x="80" y="82" textAnchor="middle" fontSize="24" fill="#6366f1">$</text>
          <rect x="30" y="30" width="30" height="5" fill="#cbd5e1" rx="2"/>
          <rect x="30" y="40" width="20" height="5" fill="#cbd5e1" rx="2"/>
          <rect x="140" y="35" width="3" height="20" fill="#cbd5e1"/>
          <rect x="145" y="40" width="3" height="15" fill="#cbd5e1"/>
          <rect x="150" y="30" width="3" height="25" fill="#cbd5e1"/>
          <rect x="155" y="35" width="3" height="20" fill="#cbd5e1"/>
          <ellipse cx="50" cy="110" rx="15" ry="8" fill="#10b981"/>
          <path d="M 120 70 L 140 50 L 145 55" stroke="#6366f1" strokeWidth="3" fill="none"/>
          <circle cx="35" cy="95" r="8" fill="#fbbf24"/>
        </svg>
      ),
      engineering: (
        <svg viewBox="0 0 200 150" className="w-full h-32">
          <rect x="20" y="20" width="160" height="110" fill="#f0f4f8" rx="8"/>
          <rect x="50" y="40" width="60" height="70" fill="#1e40af" rx="4"/>
          <rect x="55" y="45" width="50" height="8" fill="#3b82f6"/>
          <rect x="55" y="58" width="50" height="8" fill="#3b82f6"/>
          <rect x="55" y="71" width="50" height="8" fill="#3b82f6"/>
          <text x="60" y="95" fontSize="16" fill="#60a5fa">&lt;/&gt;</text>
          <circle cx="135" cy="50" r="15" fill="#10b981"/>
          <path d="M 128 50 L 133 55 L 142 45" stroke="white" strokeWidth="2" fill="none"/>
          <rect x="35" y="45" width="8" height="8" fill="#3b82f6" rx="1"/>
          <rect x="35" y="60" width="8" height="8" fill="#10b981" rx="1"/>
          <rect x="35" y="75" width="8" height="8" fill="#6366f1" rx="1"/>
          <circle cx="145" cy="95" r="12" fill="#06b6d4"/>
          <path d="M 145 88 L 145 102 M 138 95 L 152 95" stroke="white" strokeWidth="2"/>
        </svg>
      ),
      business: (
        <svg viewBox="0 0 200 150" className="w-full h-32">
          <rect x="20" y="20" width="160" height="110" fill="#f0f4f8" rx="8"/>
          <rect x="45" y="50" width="40" height="60" fill="#dbeafe" rx="4"/>
          <rect x="50" y="55" width="8" height="8" fill="#3b82f6"/>
          <rect x="62" y="55" width="8" height="8" fill="#3b82f6"/>
          <rect x="74" y="55" width="8" height="8" fill="#3b82f6"/>
          <rect x="50" y="68" width="30" height="2" fill="#93c5fd"/>
          <rect x="50" y="73" width="25" height="2" fill="#93c5fd"/>
          <rect x="50" y="78" width="30" height="2" fill="#93c5fd"/>
          <circle cx="110" cy="65" r="20" fill="white" stroke="#06b6d4" strokeWidth="3"/>
          <circle cx="110" cy="65" r="12" fill="#06b6d4" opacity="0.3"/>
          <path d="M 100 65 L 107 72 L 120 59" stroke="#06b6d4" strokeWidth="2" fill="none"/>
          <circle cx="150" cy="50" r="15" fill="#fbbf24"/>
          <path d="M 150 43 L 150 50 L 156 53" stroke="white" strokeWidth="2" fill="none"/>
          <rect x="140" y="85" width="25" height="20" fill="#e0e7ff" rx="2"/>
          <rect x="143" y="88" width="5" height="14" fill="#6366f1"/>
          <rect x="151" y="92" width="5" height="10" fill="#6366f1"/>
          <rect x="159" y="88" width="5" height="14" fill="#6366f1"/>
        </svg>
      )
    };
    return images[type] || images.finance;
  };

  const handleAddDepartment = () => {
    if (newDeptName.trim()) {
      const types = ['finance', 'engineering', 'business'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      setDepartments([...departments, {
        id: Date.now(),
        name: newDeptName,
        image: randomType
      }]);
      setNewDeptName('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Departments</h1>
            <p className="text-gray-500">This table is for test bank</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Department
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-end mb-4">
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <MoreVertical size={20} />
                </button>
              </div>
              <div className="flex justify-center mb-4">
                {getImageForType(dept.image)}
              </div>
              <h3 className="text-gray-600 text-center text-lg">{dept.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Department</h2>
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              placeholder="Department name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddDepartment()}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewDeptName('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDepartment}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestBankPage;