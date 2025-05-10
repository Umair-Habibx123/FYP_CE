import PropTypes from "prop-types";

const WarningModal = ({ theme, isOpen, message, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className={`p-6 md:p-8 rounded-2xl shadow-xl max-w-md w-full ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex items-center space-x-3">
                    <span className="text-red-600 text-3xl">⚠</span>
                    <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-red-500" : "text-red-600"}`}>Warning</h3>
                </div>
                <p className={`mt-3 text-sm md:text-base leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {message}
                </p>
                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 text-sm md:text-base rounded-lg transition ${theme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm md:text-base bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};


WarningModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
};

export default WarningModal