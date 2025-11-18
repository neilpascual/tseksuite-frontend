import React from 'react'

function EditDepartment({
    editingDept,
    onChangedEditingDept,
    onModalClosed,
    handleUpdateDepartment
}) {
  return (
    <div className="fixed inset-0 bg-blur bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 lg:p-8 max-w-md w-full mx-4 shadow-2xl transform animate-in zoom-in-95 duration-200">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
              Edit Department
            </h2>
            <input
              type="text"
              value={editingDept.dept_name}
              onChange={
                onChangedEditingDept
              }
              placeholder="Department name"
              className="w-full px-4 py-3 text-sm lg:text-base border-2 border-gray-200 rounded-xl mb-4 lg:mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              onKeyPress={(e) => e.key === "Enter" && handleUpdateDepartment()}
              autoFocus
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={ onModalClosed }
                className="flex-1 px-4 py-3 text-sm lg:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDepartment}
                disabled={!editingDept.dept_name.trim()}
                className="flex-1 px-4 py-3 text-sm lg:text-base bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </div>
          </div>
        </div>
  )
}

export default EditDepartment
