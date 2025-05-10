import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../../../auth/AuthContext.jsx";
import PropTypes from "prop-types";
import Loading from "../../../../Components/loadingIndicator/loading.jsx";
import { User, ChevronLeft, Star, StarHalf, MessageSquare, Clock, ClipboardList, Layers, BarChart2, Lock, ArrowLeft } from "lucide-react";

const RatingsOrRemarks = () => {
    const { projectId, selectionId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [reviewData, setReviewData] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [invalidProjectSearch, setInvalidProjectSearch] = useState(false);
    const [isCheckingUser, setIsCheckingUser] = useState(true);
    const [project, setProject] = useState(null);


    // Apply theme class to the body element
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);


    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            setIsCheckingUser(true);

            try {
                // 1. Fetch project details
                const projectRes = await fetch(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/fetchProjectDetailById/${projectId}`
                );
                const projectData = await projectRes.json();

                if (projectData.message === "Project not found") {
                    setProject(null);
                    setProjectDetails(null);
                    setInvalidProjectSearch(true);
                    return; // Early exit if project not found
                }

                // Set both project states if needed (assuming they serve different purposes)
                setProject(projectData);
                setProjectDetails(projectData.project || projectData); // Adjust based on your API response structure

                // 2. Check user in project (only if user exists)
                if (user?.email) {
                    const userCheckRes = await fetch(
                        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/CheckUserInProject?projectId=${projectId}&userEmail=${user.email}`
                    );
                    const userCheckData = await userCheckRes.json();

                    if (userCheckData.message !== "User is in the project") {
                        setInvalidProjectSearch(true);
                        return; // Early exit if user not in project
                    }
                    setInvalidProjectSearch(false);
                }

                // 3. Fetch review data (only if we have valid project and user)
                if (selectionId) {
                    const reviewRes = await axios.get(
                        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/getReviewForSelection/${projectId}/${selectionId}`
                    );
                    setReviewData(reviewRes.data);
                }
            } catch (err) {
                console.error("Error in fetch operations:", err);
            } finally {
                setIsLoading(false);
                setIsCheckingUser(false);
            }
        };

        fetchAllData();
    }, [projectId, user, selectionId]); // All dependencies in one place



    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(
                    <Star
                        key={i}
                        className="w-5 h-5 fill-current text-yellow-400"
                        strokeWidth={1.5}
                    />
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(
                    <StarHalf
                        key={i}
                        className="w-5 h-5 fill-current text-yellow-400"
                        strokeWidth={1.5}
                    />
                );
            } else {
                stars.push(
                    <Star
                        key={i}
                        className="w-5 h-5 text-gray-300"
                        strokeWidth={1.5}
                    />
                );
            }
        }

        return (
            <div className="flex items-center">
                {stars}
                <span className="ml-2 text-sm font-medium">
                    {rating.toFixed(1)}
                </span>
            </div>
        );
    };

    if (isLoading || isCheckingUser) {
        return <Loading />;
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
        <div className={`-mt-[70px] md:-mt-[90px] min-h-screen p-6 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${theme === "dark" ? "text-blue-400 hover:bg-gray-800" : "text-blue-600 hover:bg-gray-100"} font-medium`}
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Projects
                </button>

                <div className="mt-8 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"}`}>
                                    <ClipboardList className="w-6 h-6 text-blue-500" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    {projectDetails?.title}
                                </h1>
                            </div>
                        </div>

                        {projectDetails?.studentDetails && (
                            <div className={`flex items-center gap-3 p-3 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"} border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                                {projectDetails.studentDetails.profilePic ? (
                                    <img
                                        src={projectDetails.studentDetails.profilePic}
                                        alt={projectDetails.studentDetails.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                                        <User className="w-5 h-5 text-gray-500" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium">{projectDetails.studentDetails.username}</p>
                                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                        Project Supervisor
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {reviewData ? (
                    <div className="space-y-6">
                        <div className={`rounded-xl p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"} border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                                            <BarChart2 className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <h2 className="text-xl font-semibold">Project Feedback Summary</h2>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {renderStars(reviewData.averageRating)}
                                        <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                            ({reviewData.totalReviews} review{reviewData.totalReviews !== 1 ? 's' : ''})
                                        </span>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-3 p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                                    <MessageSquare className="w-5 h-5 text-blue-500" />
                                    <div>
                                        <span className="font-medium">Feedback Count:</span>
                                        <span className="ml-1">{reviewData.reviews.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Layers className="w-5 h-5 text-blue-500" />
                                <h3 className="text-lg font-semibold">All Reviews</h3>
                            </div>

                            {reviewData.reviews.map((review, index) => (
                                <div
                                    key={index}
                                    className={`rounded-xl overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"} border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                                >
                                    <div className="p-5 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                                                    <User className="w-5 h-5 text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{review.fullName}</p>
                                                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                                        {review.reviewerRole === 'teacher' ? 'Supervisor' : 'Representative'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end">
                                                {renderStars(review.rating)}
                                                <div className={`flex items-center gap-1 mt-1 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                                    <Clock className="w-4 h-4" />
                                                    <span>{new Date(review.reviewedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`mt-4 p-4 rounded-lg ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"} border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                                            <p className="whitespace-pre-line">{review.comments}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={`p-8 rounded-xl text-center ${theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-white shadow-sm text-gray-500"} border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-50 text-blue-500 mb-4">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium">No reviews yet</h3>
                        <p className="mt-1 max-w-md mx-auto">This project hasn&apos;t received any feedback yet. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

RatingsOrRemarks.propTypes = {
    theme: PropTypes.string.isRequired,
};

export default RatingsOrRemarks;