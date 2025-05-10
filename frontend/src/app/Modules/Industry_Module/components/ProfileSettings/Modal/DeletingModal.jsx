import { useState } from "react";
import PropTypes from "prop-types";

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    theme,
    industryName,
}) => {
    const [projectNameInput, setProjectNameInput] = useState("");
    const [confirmationText, setConfirmationText] = useState("");
    const [error, setError] = useState("");

    const handleClose = () => {
        setProjectNameInput(""); // Clear input fields
        setConfirmationText("");
        setError("");
        onClose(); // Close the modal
    };

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (projectNameInput === industryName && confirmationText === "delete representing industry") {
            setError(""); // Clear any previous error
            onConfirm();
        } else {
            setError("Inputs do not match. Please try again."); // Set error message
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
            <div
                className={`${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-gray-900"
                    } p-6 rounded-lg shadow-lg text-center transition-all duration-300`}
            >
                <h3 className="text-xl font-bold">Confirm Deletion</h3>
                <p className="my-4"> Are you sure you want to delete This Industry from your
                    <br />representation? This action cannot be undone.</p>

                {/* Error message */}
                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                <div className="my-4">
                    <label className="block text-sm font-medium mb-2">
                        Enter the Industry name <strong>{industryName}</strong> to confirm:
                    </label>
                    <input
                        type="text"
                        value={projectNameInput}
                        onChange={(e) => setProjectNameInput(e.target.value)}
                        className={`w-full p-2 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                    />
                </div>

                <div className="my-4">
                    <label className="block text-sm font-medium mb-2">
                        Type &quot;delete representing industry&quot; to confirm:
                    </label>
                    <input
                        type="text"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        className={`w-full p-2 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                    />
                </div>

                <div className="flex justify-center space-x-4">
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition-colors duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Deleting...
                            </div>
                        ) : (
                            "Delete"
                        )}
                    </button>
                    <button
                        onClick={handleClose} // Use handleClose to clear inputs and close the modal
                        disabled={loading}
                        className={`px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

DeleteConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    theme: PropTypes.oneOf(["dark", "light"]).isRequired,
    industryName: PropTypes.string.isRequired,
};

export default DeleteConfirmationModal;