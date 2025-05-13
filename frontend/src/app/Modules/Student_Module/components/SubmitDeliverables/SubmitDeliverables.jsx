import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../../../auth/AuthContext.jsx";
import PropTypes from "prop-types";
import { motion, useScroll } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import Loading from "../../../../Components/loadingIndicator/loading.jsx";
import { Lock, ArrowLeft, LogIn, XCircle, PlusCircle, Clock, User, CheckCircle, AlertCircle, X, Download } from "lucide-react"
import UploadFiles from "./Modal/UploadFiles.jsx";
import axios from "axios";

const SubmitDeliverables = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);
    const [selectionDetails, setSelectionDetails] = useState({});
    const [invalidProjectSearch, setInvalidProjectSearch] = useState(false);
    const { user, isAuthLoading } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [isCheckingUser, setIsCheckingUser] = useState(true);
    const [supervision, setSupervision] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const containerRef = useRef(null);
    const navigate = useNavigate();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);


    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);

                const projectDetailRes = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/fetchProjectDetailById/${id}`);
                const projectData = await projectDetailRes.json();

                if (projectData.message === "Project not found") {
                    setProject(null);
                    setInvalidProjectSearch(true);
                } else {
                    setProject(projectData);
                }

                if (user && user.email) {
                    const userCheckRes = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/CheckUserInProject?projectId=${id}&userEmail=${user.email}`);
                    const userCheckData = await userCheckRes.json();

                    if (userCheckData.message !== "User is in the project") {
                        setInvalidProjectSearch(true);
                    } else {
                        setInvalidProjectSearch(false);
                    }
                }

                await Promise.all([
                    fetchSupervision(),
                    fetchSelectionDetails()
                ]);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setIsLoading(false);
                setIsCheckingUser(false);
            }
        };

        if (id && user) {
            fetchAllData();
        }
    }, [id, user]);


    const fetchSupervision = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/fetchSupervisorDetails/${id}/${user.studentDetails.university}`,
            );

            if (response.data.success) {
                setSupervision(response.data.data);
                console.log(response.data.data);
            } else {
                console.error(response.data.message || "No data found");
            }
        } catch (err) {
            console.error(err.response?.data?.message || "Failed to fetch supervision details");
        } finally {
            setLoading(false);
        }
    };


    const fetchSelectionDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/fetchselectionDetails/${id}/${user.email}`
            );

            if (response.ok) {
                const data = await response.json();
                setSelectionDetails(data.studentSelection[0]);
            } else {
                console.error("Failed to fetch selection details");
            }
        } catch (error) {
            console.error("Error fetching selection details:", error);
        } finally {
            setLoading(false);
        }
    };



    const handleSubmit = async (files, comment) => {
        try {
            // Step 1: Upload files
            const uploadedFiles = await Promise.all(
                files.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);

                    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/uploadFile`, {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error("File upload failed");
                    }

                    return response.json();
                })
            );

            // Step 2: Prepare submission data
            const submissionData = {
                projectId: id,
                selectionId: selectionDetails.selectionId,
                submittedById: user.email,
                submittedByName: user.username,
                comments: comment,
                files: uploadedFiles.map((fileData) => ({
                    fileName: fileData.fileName,
                    fileUrl: fileData.fileUrl,
                    uploadedAt: new Date().toISOString(),
                })),
            };

            // Step 3: Send submission data to backend
            const submissionResponse = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/addSubmission`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            if (!submissionResponse.ok) {
                throw new Error("Submission failed");
            }

            const result = await submissionResponse.json();
            toast.success("Submission successful:", result);

            setIsModalOpen(false);
        } catch (error) {
            toast.error("Error during submission:", error);
        }
    };

    const handleSubmitClick = () => {
        if (selectionDetails?.status?.isCompleted) {
            setIsCompletedModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const isProjectExpired = (endDate) => {
        if (!endDate) return false;
        const today = new Date();
        const projectEndDate = new Date(endDate);
        return today > projectEndDate;
    };


    if (isLoading || loading || isAuthLoading || isCheckingUser || !user || !selectionDetails) {
        return <Loading />;
    }

    if (!user || !user.email) {
        return (
            <div className={`-mt-[70px] md:-mt-[90px] min-h-screen flex items-center justify-center p-6 ${theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-900"}`}>
                <div className={`${theme === "dark" ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gradient-to-br from-gray-100 to-gray-200"} p-8 md:p-12 rounded-2xl shadow-2xl max-w-lg w-full text-center transition-all duration-300`}>
                    <div className="flex items-center justify-center mb-6">
                        <Lock className="w-16 h-16 text-red-500 animate-pulse" />
                    </div>
                    <h2 className="text-4xl font-extrabold mb-4">Access Restricted</h2>
                    <p className="text-lg mb-6">You must be logged in to view this content.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className={`px-6 py-3 ${theme === "dark" ? "bg-gradient-to-r from-blue-600 to-blue-700" : "bg-gradient-to-r from-blue-500 to-blue-600"} text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg font-semibold flex items-center justify-center mx-auto`}
                    >
                        <LogIn className="w-5 h-5 mr-2" />
                        Log In
                    </button>
                </div>
            </div>
        );
    }

    if (!project || invalidProjectSearch || user.role !== "student") {
        return (
            <div className={`-mt-[70px] md:-mt-[90px] min-h-screen flex items-center justify-center p-6 ${theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-900"}`}>
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white dark:from-gray-900 dark:to-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl max-w-lg w-full text-center transition-all duration-300">
                    <div className="flex items-center justify-center mb-6">
                        <Lock className="w-16 h-16 text-red-500 animate-pulse" />
                    </div>
                    <h2 className="text-4xl font-extrabold mb-4">Access Denied</h2>
                    <p className="text-lg mb-6">You do not have permission to view this project.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg font-semibold  flex items-center justify-center mx-auto"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative -mt-[70px] md:-mt-[90px]">
            <ToastContainer />
            {/* Header Section - Fixed at Top */}
            <motion.div
                className={`border-2 sticky top-0 z-50 p-4 sm:p-8 w-full transition-all duration-300 drop-shadow-xl
${theme === "dark" ? "bg-gray-900 text-gray-100 border-gray-700" : "bg-white text-gray-900 border-gray-300"}`}
            >
                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    style={{ scaleX: scrollYProgress }}
                />

                {/* Header Content */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    {/* Back Button */}
                    <div className="w-full sm:w-2/12 mb-6 sm:mb-0">
                        <button
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                            <ArrowLeft />
                            <span>Back</span>
                        </button>
                    </div>

                    {/* Project Title */}
                    <div className="w-full sm:w-8/12 text-center mb-6 sm:mb-0">
                        <h2 className={`text-3xl sm:text-4xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {project.title}
                        </h2>
                    </div>



                    <button
                        className={`w-full sm:w-auto px-6 py-3 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center space-x-2 ${isProjectExpired(project.duration.endDate)
                            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 cursor-pointer"
                            }`}
                        onClick={!isProjectExpired(project.duration.endDate) ? handleSubmitClick : undefined}
                        disabled={isProjectExpired(project.duration.endDate)}
                    >
                        {isProjectExpired(project.duration.endDate) ? (
                            <>
                                <XCircle className="w-5 h-5" />
                                <span>Submission Closed</span>
                            </>
                        ) : (
                            <>
                                <PlusCircle className="w-5 h-5" />
                                <span>Submit...</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {isProjectExpired(project.duration.endDate) && (
                <div className={`m-4 p-4 rounded-lg text-center ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-800"}`}>
                    <p className="font-semibold">This project has expired and can no longer take actions.</p>
                    <p>The end date was {new Date(project.duration.endDate).toLocaleDateString()}.</p>
                </div>
            )}

            {/* Content Section - Scrollable */}
            <motion.div
                ref={containerRef}
                className={`p-4 sm:p-8 w-full transition-all duration-300 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
                    }`}
            >
                <motion.div className="space-y-8">
                    {/* Project Status Alert */}
                    {/* Project Status Alert */}
                    <div className="space-y-4">
                        {isProjectExpired(project.duration.endDate) && !selectionDetails?.status?.isCompleted && (
                            <div className={`p-4 rounded-lg flex items-center ${theme === "dark" ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-800"}`}>
                                <AlertCircle className="w-6 h-6 mr-3" />
                                <div>
                                    <h3 className="font-bold">Project Deadline Passed</h3>
                                    <p>The project end date has passed. Please contact your supervisor for further instructions.</p>
                                </div>
                            </div>
                        )}

                        {selectionDetails?.status?.isCompleted ? (
                            <div className={`p-4 sm:p-5 md:p-6 rounded-2xl shadow-md flex items-start gap-4 ${theme === "dark" ? "bg-green-900 text-green-100" : "bg-green-100 text-green-900"}`}>
                                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-500 mt-1 shrink-0" />
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold">Project Completed</h3>
                                    <p className="text-sm sm:text-base">This project has been marked as completed. No more submissions can be made.</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${theme === 'dark'
                                                ? selectionDetails.status.IndustryCompleted
                                                    ? 'bg-blue-800 text-blue-200'
                                                    : 'bg-gray-700 text-gray-300'
                                                : selectionDetails.status.IndustryCompleted
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {selectionDetails.status.IndustryCompleted ? 'Industry ✓' : 'Industry Pending'}
                                        </span>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${theme === 'dark'
                                                ? selectionDetails.status.TeacherCompleted
                                                    ? 'bg-purple-800 text-purple-200'
                                                    : 'bg-gray-700 text-gray-300'
                                                : selectionDetails.status.TeacherCompleted
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {selectionDetails.status.TeacherCompleted ? 'Teacher ✓' : 'Teacher Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : !isProjectExpired(project.duration.endDate) && (
                            <div className={`p-4 sm:p-5 md:p-6 rounded-2xl shadow-md flex items-start gap-4 ${theme === "dark" ? "bg-yellow-900 text-yellow-100" : "bg-yellow-100 text-yellow-900"}`}>
                                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500 mt-1 shrink-0" />
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold">Project Pending</h3>
                                    <p className="text-sm sm:text-base">This project is still in progress. You can continue making submissions.</p>
                                    {selectionDetails?.status && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${theme === 'dark'
                                                    ? selectionDetails.status.IndustryCompleted
                                                        ? 'bg-blue-800 text-blue-200'
                                                        : 'bg-gray-700 text-gray-300'
                                                    : selectionDetails.status.IndustryCompleted
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {selectionDetails.status.IndustryCompleted ? 'Industry ✓' : 'Industry Pending'}
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${theme === 'dark'
                                                    ? selectionDetails.status.TeacherCompleted
                                                        ? 'bg-purple-800 text-purple-200'
                                                        : 'bg-gray-700 text-gray-300'
                                                    : selectionDetails.status.TeacherCompleted
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {selectionDetails.status.TeacherCompleted ? 'Teacher ✓' : 'Teacher Pending'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>


                    {/* Project Description */}
                    <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"} transition-colors duration-300`}>
                        {project.description}
                    </p>


                    {/* Supervision details section */}
                    {supervision && (
                        <div className={`${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-900"} p-6 rounded-xl shadow-lg transition-all duration-300`}>
                            <h2 className="text-2xl font-bold mb-4">Supervisor Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {supervision.supervisedBy.map((supervisor, index) => (
                                    <div
                                        key={index}
                                        className={`${theme === "dark" ? "bg-gray-700" : "bg-white"} p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${supervisor.responseFromInd.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                                                    <User className="w-7 h-7" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold truncate">{supervisor.fullName}</h3>
                                                <p className="text-sm text-gray-500 truncate">Email: {supervisor.email}</p>
                                                <p className="text-sm text-gray-500">University: {supervisor.university}</p>

                                                <div className="mt-3">
                                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${supervisor.responseFromInd.status === 'approved'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                        }`}>
                                                        {supervisor.responseFromInd.status.charAt(0).toUpperCase() + supervisor.responseFromInd.status.slice(1)}
                                                    </div>
                                                </div>

                                                {supervisor.responseFromInd.comments && supervisor.responseFromInd.comments !== "null" && (
                                                    <div className={`mt-3 p-3 bg-gray-100 ${theme === "dark" ? "bg-gray-600" : "bg-gray-100"} rounded-lg`}>
                                                        <p className="text-sm italic">{supervisor.responseFromInd.comments}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Selection Details Section */}

                    {selectionDetails && (

                        < div className={`${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-900"} p-6 rounded-xl shadow-lg transition-all duration-300`}>
                            <h2 className="text-2xl font-bold mb-4">Selection Details</h2>
                            <div className="space-y-4">
                                <p><strong>Selection ID:</strong> {selectionDetails.selectionId}</p>
                                <p><strong>Joined At:</strong> {new Date(selectionDetails.joinedAt).toLocaleString()}</p>
                                <p><strong>Status:</strong> {selectionDetails.status.isCompleted ? "Completed" : "In Progress"}</p>

                                {/* Group Leader Section */}
                                {selectionDetails?.groupLeader && (
                                    <div className="mt-6">

                                        <h3 className="text-xl font-semibold mb-4">Group Leader</h3>
                                        <div className={`${theme === "dark" ? "bg-gray-700" : "bg-white"} p-4 rounded-lg shadow-md flex items-center space-x-4`}>
                                            {selectionDetails.groupLeader.profilePic ? (
                                                <img
                                                    src={selectionDetails.groupLeader.profilePic}
                                                    alt={selectionDetails.groupLeader.username}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-300">
                                                    <User className="w-6 h-6 text-gray-600" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold">{selectionDetails.groupLeader.username}</p>
                                                <p className="text-sm text-gray-500">{selectionDetails.groupLeader.email}</p>
                                                <p className="text-sm text-gray-500">Student ID: {selectionDetails.groupLeader.studentDetails.studentId}</p>
                                                <p className="text-sm text-gray-500">Degree: {selectionDetails.groupLeader.studentDetails.degreeOrProgram}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Group Members Section */}
                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold mb-4">Group Members</h3>
                                    <div className="space-y-4">
                                        {selectionDetails?.groupMembers?.map((member, index) => (
                                            <div key={index} className={`${theme === "dark" ? "bg-gray-700" : "bg-white"} p-4 rounded-lg shadow-md flex items-center space-x-4`}>
                                                {member.profilePic ? (
                                                    <img
                                                        src={member.profilePic}
                                                        alt={member.username}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-300">
                                                        <User className="w-6 h-6 text-gray-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold">{member.username}</p>
                                                    <p className="text-sm text-gray-500">{member.email}</p>
                                                    <p className="text-sm text-gray-500">Student ID: {member.studentDetails.studentId}</p>
                                                    <p className="text-sm text-gray-500">Degree: {member.studentDetails.degreeOrProgram}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>


                    )}

                    {/* Project Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-900"} p-6 rounded-xl shadow-lg transition-all duration-300`}>
                            <p><strong>Project Type:</strong> {project.projectType}</p>
                            <p><strong>Difficulty Level:</strong> {project.difficultyLevel}</p>
                        </div>
                        <div className={`${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-900"} p-6 rounded-xl shadow-lg transition-all duration-300`}>
                            <p>
                                <strong>Duration:</strong>{" "}
                                {new Date(project.duration.startDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}{" "}
                                to{" "}
                                {new Date(project.duration.endDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Additional Project Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-900"} p-6 rounded-xl shadow-lg transition-all duration-300`}>
                            <p><strong>Maximum Groups Allowed:</strong> {project.maxGroups}</p>
                            <p><strong>Belongs to Which Industry:</strong> {project.industryName}</p>
                        </div>
                        <div className={`${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-900"} p-6 rounded-xl shadow-lg transition-all duration-300`}>
                            <p><strong>Maximum Students Per Groups:</strong> {project.maxStudentsPerGroup}</p>
                        </div>
                    </div>

                    {/* Required Skills */}
                    <div className={`${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-900"} p-6 rounded-xl shadow-lg transition-all duration-300`}>
                        <p className="font-semibold mb-4">Required Skills:</p>
                        <ul className="list-disc list-inside">
                            {project.requiredSkills.map((skill, index) => (
                                <li key={index}>{skill}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Additional Info */}
                    {project.additionalInfo && (
                        <div className={`${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-900"} p-6 rounded-xl shadow-lg transition-all duration-300`}>
                            <p className="font-semibold mb-4">Additional Info:</p>
                            <p>{project.additionalInfo}</p>
                        </div>
                    )}

                    {/* Attachments */}
                    {project.attachments && project.attachments.length > 0 && (
                        <div className={`${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-900"} p-6 rounded-xl shadow-lg transition-all duration-300`}>
                            <p className="font-semibold mb-4">Attachments:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {project.attachments.map((attachment, index) => (
                                    <div key={index} className={`flex flex-col p-4 rounded-xl ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"} transition-all duration-300 transform hover:scale-105`}>
                                        <div className="flex items-center mb-3">
                                            <i className={`fas fa-file ${theme === "dark" ? "text-gray-300" : "text-gray-500"} text-xl mr-3`}></i>
                                            <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-900"} truncate`} title={attachment.fileName}>
                                                {attachment.fileName}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-3`}>
                                            Uploaded at: {new Date(attachment.uploadedAt).toLocaleDateString()}
                                        </p>
                                        <a
                                            href={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}${attachment.fileUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`self-end ${theme === "dark" ? "text-gray-300 hover:text-gray-100" : "text-gray-500 hover:text-gray-700"} transition-colors duration-300`}
                                        >
                                            <i className="text-lg"><Download size={20} /></i>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>

            {/* Upload Files Modal - For active projects */}
            {
                !selectionDetails?.status?.isCompleted && (
                    <UploadFiles
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Add Files"
                        theme={theme}
                        name={user.username}
                        email={user.email}
                        onSubmit={handleSubmit}
                    />
                )
            }

            {/* Completed Project Modal */}
            {
                isCompletedModalOpen && (
                    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme === "dark" ? "bg-black/40 backdrop-blur-sm" : "bg-gray-500/40 backdrop-blur-sm"}`}>
                        <div className={`relative w-full max-w-md rounded-2xl shadow-xl transition-all ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setIsCompletedModalOpen(false)}
                                    className={`p-1 rounded-full ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                                    <h2 className="text-2xl font-bold mb-2">Project Completed</h2>
                                    <p className="mb-6">This project has been marked as completed. No more submissions can be made.</p>

                                    <div className="w-full mb-6 p-4 rounded-lg bg-opacity-20 bg-green-500">
                                        <h3 className="text-xl font-bold mb-2">Project Details</h3>
                                        <p><strong>Title:</strong> {project.title}</p>
                                        <p><strong>Type:</strong> {project.projectType}</p>
                                        <p>
                                            <strong>Duration:</strong>{" "}
                                            {new Date(project.duration.startDate).toLocaleDateString()} - {" "}
                                            {new Date(project.duration.endDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setIsCompletedModalOpen(false)}
                                        className={`px-6 py-3 rounded-lg ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors duration-300`}
                                    >
                                        Understood
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

SubmitDeliverables.propTypes = {
    theme: PropTypes.string.isRequired,
};

export default SubmitDeliverables