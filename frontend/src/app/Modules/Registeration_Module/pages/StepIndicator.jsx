import PropTypes from "prop-types";
import { motion } from "framer-motion";

const StepIndicator = ({ step, colors, labels }) => {
    const totalSteps = labels.length;
    const stepPercentage = ((step - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="relative flex flex-col justify-center items-center w-full max-w-lg py-4 px-6">
            {/* Background Line */}
            <div className="absolute top-[calc(50%-12px)] left-0 right-0 h-[4px] bg-gray-300 transform -translate-y-1/2 z-0 rounded-full"></div>

            {/* Animated Progress Bar */}
            <motion.div
                className="absolute top-[calc(50%-12px)] left-0 h-[4px] rounded-full z-10"
                initial={{ width: "0%" }}
                animate={{ width: `${stepPercentage}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{
                    background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary || colors.primary} 100%)`,
                }}
            ></motion.div>

            {/* Step Circles and Labels */}
            <div className="relative z-20 flex w-full justify-between">
                {labels.map((label, index) => {
                    const isActive = step >= index + 1;
                    return (
                        <div key={index} className="relative flex-1 flex flex-col items-center">
                            {/* Step Circle */}
                            <motion.div
                                className={`w-12 h-12 flex items-center justify-center rounded-full font-semibold text-lg transition-all duration-300 shadow-md ${
                                    isActive ? "text-white shadow-lg" : "text-gray-500 border border-gray-400"
                                }`}
                                initial={{ scale: 0.9 }}
                                animate={{ scale: step === index + 1 ? 1.1 : 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                style={{
                                    backgroundColor: isActive ? colors.primary : "white",
                                    border: `2px solid ${isActive ? colors.primary : colors.gray400}`,
                                    boxShadow: step === index + 1 ? `0px 0px 15px 2px ${colors.primary}` : "none",
                                }}
                            >
                                {index + 1}
                            </motion.div>

                            {/* Step Label */}
                            <div className="mt-2 text-center">
                                <span className={`text-sm font-medium transition-all duration-300 ${
                                    isActive ? "text-gray-900" : "text-gray-500"
                                }`}>
                                    {label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

StepIndicator.propTypes = {
    step: PropTypes.number.isRequired,
    colors: PropTypes.shape({
        primary: PropTypes.string.isRequired,
        secondary: PropTypes.string,
        gray400: PropTypes.string.isRequired,
    }).isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
};


export default StepIndicator



// import PropTypes from "prop-types";
// import { motion } from "framer-motion";

// const StepIndicator = ({ step, colors, labels }) => {
//     return (
//         <div className="relative flex flex-col justify-center items-center w-full py-4 px-2 sm:px-6">
//             <div className="text-center w-full">
//                 {/* Steps Container */}
//                 <div
//                     className="flex justify-around mb-3 p-3 sm:p-5 w-full rounded-lg"
//                     style={{
//                         backgroundColor: colors.gray400,
//                         boxShadow: '0 0 15px 5px #9810fa'
//                     }}
//                 >
//                 {labels.map((label, index) => {
//                     const isActive = step >= index + 1;
//                     return (
//                         <div key={index} className="flex flex-col items-center">
//                             {/* Step Circle */}
//                             <motion.div
//                                 className={`w-8 h-8 flex items-center justify-center rounded-full ${isActive ? "text-white shadow-lg" : "text-gray-500"
//                                     }`}
//                                 initial={{ scale: 0.9 }}
//                                 animate={{ scale: step === index + 1 ? 1.1 : 1 }}
//                                 transition={{ type: "spring", stiffness: 200, damping: 10 }}
//                                 style={{
//                                     backgroundColor: isActive ? colors.primary : colors.white,
//                                     border: `2px solid ${isActive ? colors.primary : colors.gray400}`,
//                                     boxShadow: step === index + 1 ? `0px 0px 15px 2px ${colors.primary}` : "none",
//                                 }}
//                             >
//                                 {index + 1}
//                             </motion.div>

//                             {/* Label Text */}
//                             <div
//                                 className={`mt-2 text-sm sm:text-base font-medium ${isActive ? "font-semibold" : "font-normal"
//                                     }`}
//                                 style={{
//                                     color: isActive ? colors.primary : colors.gray500,
//                                 }}
//                             >
//                                 {label}
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//         </div >
//     );
// };

// StepIndicator.propTypes = {
//     step: PropTypes.number.isRequired,
//     colors: PropTypes.shape({
//         primary: PropTypes.string.isRequired,
//         secondary: PropTypes.string,
//         white: PropTypes.string,
//         gray400: PropTypes.string.isRequired,
//         gray500: PropTypes.string,
//     }).isRequired,
//     labels: PropTypes.arrayOf(PropTypes.string).isRequired,
// };

// export default StepIndicator;