import { Trash2 } from 'lucide-react';
import React from 'react'

function DeleteDepartment({
    deletingDept,
    onModalClosed,
    handleDeleteDepartment
}) {
  return (
     <div className="fixed inset-0 bg-blur bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
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
                onClick={ onModalClosed }
                className="flex-1 px-4 py-3 text-sm lg:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={ handleDeleteDepartment }
                className="flex-1 px-4 py-3 text-sm lg:text-base bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
  )
}

export default DeleteDepartment
