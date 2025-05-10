import PropTypes from "prop-types";
import { useEffect } from "react";

const AddCommentModal = ({ isOpen, onClose, onConfirm, isLoading, comments, setComments, theme }) => {
    useEffect(() => {
        if (isOpen && !comments) {
            setComments("Approved by project owner");
        }
    }, [isOpen, comments, setComments]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
            <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                <h2 className="text-xl font-bold mb-4">Add Comments</h2>
                <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className={`resize-none h-48 w-96 p-2 border rounded-lg mb-4 
                        ${theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 text-black hover:bg-gray-200"}`}
                    rows="4"
                    placeholder="Enter comments..."
                />
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2 hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        {isLoading ? "Saving..." : "OK"}
                    </button>
                </div>
            </div>
        </div>
    );
};

AddCommentModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    comments: PropTypes.string.isRequired,
    setComments: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
};

AddCommentModal.defaultProps = {
    isLoading: false,
};

export default AddCommentModal;
