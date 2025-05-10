import PropTypes from "prop-types";

const ConfirmationModal = ({ theme, isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className={`p-6 rounded-lg shadow-lg w-96  ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className={` ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{message}</p>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        className={`px-4 py-2 rounded  ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className={`px-4 py-2 rounded text-white  ${theme === 'dark' ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'}`}
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>

    );
};

ConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired, // Function to close the modal

};


export default ConfirmationModal