import PropTypes from "prop-types";

const UniversityApprovalModal = ({ isOpen, onClose, approvals, theme }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme === "dark" ? "bg-black/40 backdrop-blur-md" : "bg-black/40 backdrop-blur-md"}`}>
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-6 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6">University Approval Details</h2>
        
        {approvals.length === 0 ? (
          <p className="text-center py-4">No approval data available</p>
        ) : (
          <div className="space-y-6">
            {approvals.map((approval, index) => (
              <div key={index} className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{approval.fullName} ({approval.teacherId})</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    approval.status === "approved" ? "bg-green-100 text-green-800" :
                    approval.status === "rejected" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {approval.status}
                  </span>
                </div>
                <p className="text-sm opacity-80 mb-2">University: {approval.university}</p>
                {approval.comments && (
                  <div className="mt-2">
                    <p className="font-medium">Comments:</p>
                    <p className={`mt-1 p-2 rounded ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"}`}>
                      {approval.comments}
                    </p>
                  </div>
                )}
                <p className="text-xs mt-3 opacity-70">
                  Action taken on: {new Date(approval.actionAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

UniversityApprovalModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  approvals: PropTypes.array.isRequired,
  theme: PropTypes.string.isRequired,
};

export default UniversityApprovalModal;