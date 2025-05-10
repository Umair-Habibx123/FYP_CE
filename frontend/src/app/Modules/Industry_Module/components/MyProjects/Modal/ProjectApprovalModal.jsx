import PropTypes from 'prop-types';
import { CircleX } from "lucide-react";

const UniversityApprovalModal = ({ 
  isOpen, 
  onClose, 
  teacherDetails, 
  approvalDetails, 
  theme 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`rounded-xl p-6 w-full max-w-2xl mx-4 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Approval Details</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          >
            <CircleX />
          </button>
        </div>

        {teacherDetails && (
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3">Teacher Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Name:</strong> {teacherDetails.username}</p>
                <p><strong>Email:</strong> {teacherDetails.email}</p>
                <p><strong>Designation:</strong> {teacherDetails.teacherDetails?.designation || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Department:</strong> {teacherDetails.teacherDetails?.department || 'N/A'}</p>
                <p><strong>University:</strong> {teacherDetails.teacherDetails?.university || 'N/A'}</p>
                <p><strong>Status:</strong> {teacherDetails.status}</p>
              </div>
            </div>
            {teacherDetails.profilePic && (
              <div className="mt-4">
                <img 
                  src={teacherDetails.profilePic} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {approvalDetails && (
          <div>
            <h4 className="text-xl font-semibold mb-3">Approval Decision</h4>
            <div className={`p-4 rounded-lg mb-4 ${approvalDetails.status === 'approved' ? 'bg-green-100 text-green-800' : 
                           approvalDetails.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
              <p><strong>Status:</strong> {approvalDetails.status}</p>
              <p><strong>Decision Date:</strong> {new Date(approvalDetails.updatedAt).toLocaleString()}</p>
            </div>
            
            {approvalDetails.comments && (
              <div className="mb-4">
                <h5 className="font-semibold mb-2">Comments:</h5>
                <p className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                  {approvalDetails.comments}
                </p>
              </div>
            )}

            {approvalDetails.additionalRequirements && approvalDetails.additionalRequirements.length > 0 && (
              <div className="mb-4">
                <h5 className="font-semibold mb-2">Additional Requirements:</h5>
                <ul className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                  {approvalDetails.additionalRequirements.map((req, index) => (
                    <li key={index} className="mb-1">- {req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

UniversityApprovalModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  teacherDetails: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.string,
    profilePic: PropTypes.string,
    teacherDetails: PropTypes.shape({
      designation: PropTypes.string,
      department: PropTypes.string,
      university: PropTypes.string,
    }),
  }),
  approvalDetails: PropTypes.shape({
    status: PropTypes.oneOf(['approved', 'rejected', 'needMoreInfo']),
    updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    comments: PropTypes.string,
    additionalRequirements: PropTypes.arrayOf(PropTypes.string),
  }),
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
};

export default UniversityApprovalModal;