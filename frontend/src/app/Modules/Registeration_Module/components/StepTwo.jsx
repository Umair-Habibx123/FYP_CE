import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useRef, useEffect } from "react";

const StepTwo = ({ code, setCode, handleVerifyCode, loading }) => {
    const inputRefs = useRef([]);

    const codeArray = code.split("").concat(Array(6 - code.length).fill(""));

    const handleInputChange = (index, value) => {
        if (/^\d$/.test(value) || value === "") {
            const newCodeArray = [...codeArray];
            newCodeArray[index] = value;
            setCode(newCodeArray.join(""));

            // Move focus to the next input box
            if (value !== "" && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault(); // Prevent default paste behavior
        const pastedText = e.clipboardData.getData("text/plain"); // Get pasted text
        const digits = pastedText.replace(/\D/g, "").split("").slice(0, 6); // Extract only digits and limit to 6

        if (digits.length > 0) {
            const newCodeArray = [...codeArray];
            digits.forEach((digit, i) => {
                if (i < 6) {
                    newCodeArray[i] = digit;
                }
            });
            setCode(newCodeArray.join(""));

            // Move focus to the last filled input box
            const lastFilledIndex = digits.length - 1;
            if (lastFilledIndex < 5) {
                inputRefs.current[lastFilledIndex + 1].focus();
            } else {
                inputRefs.current[5].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && index > 0 && codeArray[index] === "") {
            inputRefs.current[index - 1].focus();
        }
    };

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    return (
        <div className='bg-white p-4 md:p-8 rounded-2xl shadow-2xl max-w-sm md:max-w-md mx-auto w-full'>
            <motion.h2
                className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Enter Verification Code
            </motion.h2>
            <div className="flex justify-center space-x-2 md:space-x-4 mb-4 md:mb-6">
                {codeArray.map((digit, index) => (
                    <motion.input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste} // Add paste handler
                        ref={(el) => (inputRefs.current[index] = el)}
                        className={`w-10 h-10 md:w-16 md:h-16 text-center text-lg md:text-2xl font-bold border-2 rounded-lg outline-none transition-all ${digit
                            ? "border-purple-500 focus:border-purple-700 focus:ring-2 focus:ring-purple-300"
                            : "border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300"
                            }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        disabled={loading}
                    />
                ))}
            </div>
            {loading ? (
                <motion.div
                    className="flex justify-center items-center mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <svg className="animate-spin h-6 w-6 text-purple-600" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                        />
                    </svg>
                    <span className="ml-2 text-purple-600 text-sm font-semibold">Processing...</span>
                </motion.div>
            ) : (
                <motion.button
                    onClick={handleVerifyCode}
                    className={`cursor-pointer w-full p-2 md:p-4 rounded-lg font-semibold text-sm transition-all ${code.length === 6
                        ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-purple-500/30"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    disabled={code.length !== 6 || loading}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    Verify Code
                </motion.button>
            )}
        </div>
    );
};

StepTwo.propTypes = {
    code: PropTypes.string.isRequired,
    setCode: PropTypes.func.isRequired,
    handleVerifyCode: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default StepTwo;