const ConfirmationModal = ({
  title = "Are you sure?",
  message = "Please confirm your action.",
  checklist = [],
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onClose,
  onConfirm,
  confirmColor,
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50 px-2">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-[#2E99B0]">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>

        {checklist.length > 0 && (
          <ul className="text-sm text-gray-600 mb-6 list-disc list-inside space-y-1">
            {checklist.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-white text-sm bg-${confirmColor}-500 hover:bg-${confirmColor}-600`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
