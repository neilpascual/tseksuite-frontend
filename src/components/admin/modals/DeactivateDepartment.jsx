import { Power } from 'lucide-react';

function DeactivateDepartment({
    deactivateDept,
    handleDeactivateClicked,
    onModalClosed
}) {
  return (
     <div className="fixed inset-0 bg-blur bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl p-6 lg:p-8 max-w-md w-full mx-4 shadow-2xl transform animate-in zoom-in-95 duration-200">
      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Power size={24} className="text-orange-600" />
      </div>
      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 text-center">
        {deactivateDept.is_active ? "Deactivate Department" : "Activate Department"}
      </h2>
      <p className="text-gray-600 text-sm lg:text-base mb-4 lg:mb-6 text-center">
        Are you sure you want to {deactivateDept.is_active ? "deactivate" : "activate"}{" "}
        <strong className="text-gray-900">{deactivateDept.dept_name}</strong>?
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={ onModalClosed }
          className="flex-1 px-4 py-3 text-sm lg:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
        >
          Cancel
        </button>

        <button
          onClick={ handleDeactivateClicked }
          className={`flex-1 px-4 py-3 text-sm lg:text-base ${
            deactivateDept.is_active
              ? "bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              : "bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          } text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl`}
        >
          {deactivateDept.is_active ? "Deactivate" : "Activate"}
        </button>
      </div>
    </div>
  </div>
  )
}

export default DeactivateDepartment
