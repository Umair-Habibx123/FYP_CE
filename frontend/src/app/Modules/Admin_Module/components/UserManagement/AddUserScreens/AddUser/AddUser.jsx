import PropTypes from 'prop-types';
import { useLocation } from "react-router-dom";


const UserDetails = ({ theme, userDetails, handleUserDetailsChange }) => {

    const location = useLocation();

    const getRoleFromRoute = () => {
        if (location.pathname.includes("/add-teacher-user")) return "teacher";
        if (location.pathname.includes("/add-industry-user")) return "industry";
        if (location.pathname.includes("/add-student-user")) return "student";
        if (location.pathname.includes("/add-admin")) return "admin";
        return "";
    };

    const role = getRoleFromRoute();


    return (
        <div className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold mb-6">User Details</h2>
                {/* Status */}
                <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                        name="status"
                        value={userDetails.status}
                        onChange={handleUserDetailsChange}
                        className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                        required
                    >
                        <option value="verified">Verified</option>
                        <option value="pending">Pending</option>
                        <option value="banned">Banned</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        value={userDetails.username}
                        onChange={handleUserDetailsChange}
                        className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={userDetails.email}
                        onChange={handleUserDetailsChange}
                        className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={userDetails.password}
                        onChange={handleUserDetailsChange}
                        className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                        required
                    />
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium mb-2">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={userDetails.confirmPassword}
                        onChange={handleUserDetailsChange}
                        className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                        required
                    />
                </div>

                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 relative">
                        {userDetails.profilePicture ? (
                            <>
                                <img
                                    src={URL.createObjectURL(userDetails.profilePicture)}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleUserDetailsChange({
                                            target: { name: 'profilePicture', value: null },
                                        })
                                    }
                                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-gray-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </div>
                    <input
                        type="file"
                        name="profilePicture"
                        accept=".jpg, .png, .jpeg"
                        onChange={handleUserDetailsChange}
                        className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select
                        name="role"
                        value={role} // Set role dynamically
                        className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                        disabled
                    >
                        <option value={role}>{role}</option>
                    </select>
                </div>



            </div>
        </div>
    );
};

UserDetails.propTypes = {
    theme: PropTypes.oneOf(['light', 'dark']).isRequired,
    userDetails: PropTypes.shape({
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        confirmPassword: PropTypes.string.isRequired,
        profilePicture: PropTypes.instanceOf(File),
        role: PropTypes.string.isRequired,
        status: PropTypes.oneOf(['verified', 'pending', 'banned']).isRequired,
    }).isRequired,
    handleUserDetailsChange: PropTypes.func.isRequired,
};

export default UserDetails;