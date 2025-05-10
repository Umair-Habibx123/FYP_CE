import PropTypes from "prop-types";

const IndustryDetails = ({ theme, industryDetails, handleIndustryDetailsChange, addIndustryDetails, handleRemoveIndustryDetails }) => {
    return (
        <div className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <h2 className="text-2xl font-semibold mb-6">Industry Details</h2>
            {industryDetails.map((industry, index) => (
                <div key={index} className={`mb-8 p-6 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-semibold">Industry {index + 1}</h3>
                        <div>
                            <label className="block text-sm font-medium mb-2">Verified</label>
                            <select
                                name="verified"
                                value={industry.verified} // Use boolean directly
                                onChange={(e) => handleIndustryDetailsChange(index, e)}
                                className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                            >
                                <option value={true}>Verified</option>
                                <option value={false}>Unverified</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Industry Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Industry Name</label>
                            <input
                                type="text"
                                name="industryName"
                                placeholder="Enter industry name"
                                value={industry.industryName}
                                onChange={(e) => handleIndustryDetailsChange(index, e)}
                                className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                                required
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Website</label>
                            <input
                                type="text"
                                name="website"
                                placeholder="Enter website URL"
                                value={industry.website}
                                onChange={(e) => handleIndustryDetailsChange(index, e)}
                                className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                                required
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Enter address"
                                value={industry.address}
                                onChange={(e) => handleIndustryDetailsChange(index, e)}
                                className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                                required
                            />
                        </div>

                        {/* Designation */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Designation</label>
                            <input
                                type="text"
                                name="designation"
                                placeholder="Enter designation"
                                value={industry.designation}
                                onChange={(e) => handleIndustryDetailsChange(index, e)}
                                className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                                required
                            />
                        </div>

                        {/* Work Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Work Email</label>
                            <input
                                type="email"
                                name="workEmail"
                                placeholder="Enter work email"
                                value={industry.workEmail}
                                onChange={(e) => handleIndustryDetailsChange(index, e)}
                                className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                                required
                            />
                        </div>

                        {/* Company Contact Number */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Company Contact Number</label>
                            <input
                                type="text"
                                name="companyContactNumber"
                                placeholder="Enter contact number"
                                value={industry.companyContactNumber}
                                onChange={(e) => handleIndustryDetailsChange(index, e)}
                                className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                                required
                            />
                        </div>

                    </div>
                </div>
            ))}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={addIndustryDetails}
                    className={`w-full p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    Add Industry
                </button>
                {industryDetails.length > 1 && (
                    <button
                        type="button"
                        onClick={handleRemoveIndustryDetails}
                        className={`w-full p-3 rounded-lg ${theme === 'dark' ? 'bg-red-700 hover:bg-red-600' : 'bg-red-200 hover:bg-red-300'}`}
                    >
                        Remove Industry
                    </button>
                )}
            </div>
        </div>
    );
};

// Prop Types Validation
IndustryDetails.propTypes = {
    theme: PropTypes.oneOf(['light', 'dark']).isRequired,
    industryDetails: PropTypes.arrayOf(
        PropTypes.shape({
            verified: PropTypes.bool.isRequired,
            industryName: PropTypes.string.isRequired,
            website: PropTypes.string.isRequired,
            address: PropTypes.string.isRequired,
            designation: PropTypes.string.isRequired,
            workEmail: PropTypes.string.isRequired,
            companyContactNumber: PropTypes.string.isRequired,
        })
    ).isRequired,
    handleIndustryDetailsChange: PropTypes.func.isRequired,
    addIndustryDetails: PropTypes.func.isRequired,
    handleRemoveIndustryDetails: PropTypes.func.isRequired,
};

export default IndustryDetails;