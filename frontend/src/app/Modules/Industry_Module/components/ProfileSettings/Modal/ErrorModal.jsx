import PropTypes from "prop-types";

const ErrorModal = ({ theme, isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm ${theme === 'dark' ? 'bg-black/60' : 'bg-black/40'}`}>
            <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} p-6 rounded-lg shadow-lg w-96`}>
                <h2 className="text-xl font-semibold mb-2">Error</h2>
                <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{message}</p>
                <button
                    className={`mt-4 px-4 py-2 ${theme === 'dark' ? 'bg-red-700 hover:bg-red-800' : 'bg-red-500 hover:bg-red-600'} text-white rounded`}
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>

    );
};

ErrorModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,  // Boolean flag to show/hide the modal
    message: PropTypes.string.isRequired, // Error message should be a string
    onClose: PropTypes.func.isRequired, // Function to close the modal
    theme: PropTypes.string.isRequired,

};

export default ErrorModal