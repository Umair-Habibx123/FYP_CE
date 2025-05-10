import PropTypes from "prop-types";
import { UNIVERSITY } from "../../../../../../../constants/constants"


const StudentDetails = ({ theme, studentDetails, handleStudentDetailsChange }) => {
    return (
        <div className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold mb-6">Student Details</h2>
                <div>
                    <label className="block text-sm font-medium mb-2">Verified</label>
                    <select
                        name="verified"
                        value={studentDetails.verified ? "true" : "false"} // Convert boolean to string
                        onChange={handleStudentDetailsChange}
                        className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                    >
                        <option value="true">Verified</option>
                        <option value="false">Unverified</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee ID */}
                <div>
                    <label className="block text-sm font-medium mb-2">Student ID</label>
                    <input
                        type="text"
                        name="studentId"
                        placeholder="Enter student ID"
                        value={studentDetails.studentId}
                        onChange={handleStudentDetailsChange}
                        className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                        required
                    />
                </div>

                {/* Designation */}
                <div>
                    <label className="block text-sm font-medium mb-2">Degree / Program</label>
                    <input
                        type="text"
                        name="degreeOrProgram"
                        placeholder="Enter Degree / Program"
                        value={studentDetails.degreeOrProgram}
                        onChange={handleStudentDetailsChange}
                        className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                        required
                    />
                </div>

                {/* Department */}
                <div>
                    <label className="block text-sm font-medium mb-2">Year Of Study</label>
                    <input
                        type="text"
                        name="yearOfStudy"
                        placeholder="Enter Year Of Study"
                        value={studentDetails.yearOfStudy}
                        onChange={handleStudentDetailsChange}
                        className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                        required
                    />
                </div>

                {/* University */}

                <div>
                    <label className="block text-sm font-medium mb-2">University</label>
                    <select
                        name="university"
                        value={studentDetails.university}
                        onChange={handleStudentDetailsChange}
                        className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                        required
                    >
                        <option value="" disabled>Select University</option>
                        {UNIVERSITY.map((university) => (
                            <option key={university.value} value={university.value}>
                                {university.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

        </div>
    );
};

// Prop Types Validation
StudentDetails.propTypes = {
    theme: PropTypes.oneOf(['light', 'dark']).isRequired,
    studentDetails: PropTypes.shape({
        studentId: PropTypes.string.isRequired,
        degreeOrProgram: PropTypes.string.isRequired,
        yearOfStudy: PropTypes.string.isRequired,
        university: PropTypes.string.isRequired,
        verified: PropTypes.bool.isRequired,
    }).isRequired,
    handleStudentDetailsChange: PropTypes.func.isRequired,
    handleRemoveFile: PropTypes.func.isRequired,
};

export default StudentDetails;