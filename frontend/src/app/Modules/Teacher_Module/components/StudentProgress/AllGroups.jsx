import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../../../auth/AuthContext.jsx";
import PropTypes from "prop-types";
import Loading from "../../../../Components/loadingIndicator/loading.jsx";
import { User, ChevronLeft, FileText, CheckCircle, AlertCircle, Users, Award, Calendar, ArrowRight, Search, Filter, ChevronDown, ChevronUp, Star, ClipboardList, Lock, ArrowLeft, LogIn } from "lucide-react";

const AllGroups = () => {
    const { projectId_evaluation } = useParams();
    const projectId = projectId_evaluation.split('_')[0];
    const { user, isAuthLoading } = useAuth();
    const [project, setProject] = useState({ studentSelection: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invalidProjectSearch, setInvalidProjectSearch] = useState(false);
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [canAccess, setCanAccess] = useState(true);


    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                setInvalidProjectSearch(false);

                // 1. First fetch basic project details
                const projectResponse = await fetch(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/fetchProjectDetailById/${projectId}`
                );
                const projectData = await projectResponse.json();

                if (projectData.message === "Project not found") {
                    setProject("Project not found");
                    setInvalidProjectSearch(true);
                    return; // Exit early if project not found
                }

                setProject(projectData);

                // 2. Check teacher supervision status if user data is available
                if (user?.email && user?.teacherDetails?.university) {
                    try {
                        const supervisionResponse = await axios.post(
                            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/currentTeacherSupervisionStatusForProject`,
                            {
                                projectId,
                                email: user.email,
                                university: user.teacherDetails.university
                            }
                        );

                        const canAccessNow = supervisionResponse.data.status === "approved";
                        setCanAccess(canAccessNow);

                        // 3. Only fetch detailed project info if access is granted
                        if (canAccessNow) {
                            const detailsResponse = await axios.get(
                                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/getAllSelectionGroupsForTeachers`,
                                {
                                    params: {
                                        university: user.teacherDetails.university,
                                        projectId
                                    }
                                }
                            );

                            if (detailsResponse.data?.message === "No matching selection groups found") {
                                setProject(prev => ({
                                    ...prev,
                                    studentSelection: []
                                }));
                            } else {
                                setProject(detailsResponse.data);
                            }
                        }
                    } catch (err) {
                        console.error("Error in teacher-specific requests:", err);
                        if (err.response?.status === 404) {
                            setCanAccess(false);
                        } else {
                            setError("Failed to load teacher-specific data");
                        }
                    }
                }
            } catch (err) {
                console.error("Error in data fetching:", err);
                setError("Failed to load project data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [projectId, user]); // Only these dependencies needed

    const getUniqueStudents = (selection) => {
        const uniqueEmails = new Set();
        return selection.students.filter(student => {
            if (!uniqueEmails.has(student.email)) {
                uniqueEmails.add(student.email);
                return true;
            }
            return false;
        });
    };

    const filteredGroups = project?.studentSelection?.filter(selection => {
        const matchesSearch = searchTerm === "" ||
            selection.selectionId.toString().includes(searchTerm.toLowerCase()) ||
            selection.students.some(student =>
                student.username.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "completed" && selection.isCompleted) ||
            (statusFilter === "pending" && !selection.isCompleted);

        return matchesSearch && matchesStatus;
    }) || [];

    if (!user || isLoading || canAccess === null || isAuthLoading) {
        return <Loading />;
    }


    if (!user || !user.email) {
        return (
            <div className={`-mt-[70px] md:-mt-[90px] min-h-screen flex items-center justify-center p-6 ${theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-900"}`}>
                <div className={`${theme === "dark" ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gradient-to-br from-gray-100 to-gray-200"} p-8 md:p-12 rounded-2xl shadow-2xl max-w-lg w-full text-center transition-all duration-300`}>
                    <div className="flex items-center justify-center mb-6">
                        {/* Icon or Image */}
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


    if (invalidProjectSearch || user.role !== "teacher" || !canAccess) {
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

    if (error) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-[50vh] p-8 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                <div className={`p-4 rounded-full ${theme === "dark" ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-600"}`}>
                    <AlertCircle className="w-12 h-12" />
                </div>
                <p className="text-xl font-medium mt-4 text-center">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className={`mt-6 px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-blue-400" : "bg-gray-100 hover:bg-gray-200 text-blue-600"}`}
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!project) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-[50vh] p-8 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                <div className={`p-4 rounded-full ${theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                    <FileText className="w-12 h-12" />
                </div>
                <p className="text-xl font-medium mt-4">Project not found</p>
                <button
                    onClick={() => navigate(-1)}
                    className={`mt-6 px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-blue-400" : "bg-gray-100 hover:bg-gray-200 text-blue-600"}`}
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Projects
                </button>
            </div>
        );
    }

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className={`-mt-[70px] md:-mt-[90px] min-h-screen p-4 md:p-8 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={handleBackClick}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${theme === "dark" ? "hover:bg-gray-800/50 text-blue-400" : "hover:bg-gray-100 text-blue-600"}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="font-medium">Back</span>
                        </button>

                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-white shadow"}`}>
                            <Users className="w-5 h-5" />
                            <span className="font-medium">{filteredGroups.length} {filteredGroups.length === 1 ? 'Group' : 'Groups'}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                Project Groups
                            </span>
                        </h1>
                        <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                            Manage and evaluate student groups for this project
                        </p>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className={`relative flex-1 ${theme === "dark" ? "bg-gray-800/50" : "bg-white"} rounded-lg shadow`}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search groups or students..."
                            className={`w-full pl-10 pr-4 py-3 rounded-lg ${theme === "dark" ? "bg-gray-800/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50" : "bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50"} border-none focus:outline-none`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 w-full md:w-48 px-4 py-3 rounded-lg ${theme === "dark" ? "bg-gray-800/50 hover:bg-gray-800" : "bg-white hover:bg-gray-50"} shadow transition-all`}
                        >
                            <Filter className="w-5 h-5" />
                            <span className="font-medium">Filter</span>
                            {isFilterOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>

                        {isFilterOpen && (
                            <div className={`absolute right-0 mt-2 w-full md:w-48 rounded-lg shadow-lg z-10 ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
                                <div className="p-2">
                                    <label className={`block px-3 py-2 rounded-md text-sm font-medium ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer`}>
                                        <input
                                            type="radio"
                                            className="mr-2"
                                            name="statusFilter"
                                            value="all"
                                            checked={statusFilter === "all"}
                                            onChange={() => setStatusFilter("all")}
                                        />
                                        All Status
                                    </label>
                                    <label className={`block px-3 py-2 rounded-md text-sm font-medium ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer`}>
                                        <input
                                            type="radio"
                                            className="mr-2"
                                            name="statusFilter"
                                            value="completed"
                                            checked={statusFilter === "completed"}
                                            onChange={() => setStatusFilter("completed")}
                                        />
                                        Completed
                                    </label>
                                    <label className={`block px-3 py-2 rounded-md text-sm font-medium ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer`}>
                                        <input
                                            type="radio"
                                            className="mr-2"
                                            name="statusFilter"
                                            value="pending"
                                            checked={statusFilter === "pending"}
                                            onChange={() => setStatusFilter("pending")}
                                        />
                                        Pending
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Filters Display */}
                {(statusFilter !== "all") && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {statusFilter !== "all" && (
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${theme === "dark" ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
                                <span>Status: {statusFilter}</span>
                                <button onClick={() => setStatusFilter("all")} className="focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}


                {/* Main Content */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-semibold">Evaluation Groups</h2>
                    </div>

                    {!isLoading && filteredGroups.length === 0 ? (
                        <div className={`flex flex-col items-center justify-center p-12 rounded-xl text-center ${theme === "dark" ? "bg-gray-800/50 border border-gray-700" : "bg-white shadow border border-gray-200"}`}>
                            <div className={`p-4 rounded-full mb-4 ${theme === "dark" ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400"}`}>
                                <FileText className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">
                                No Groups Formed Yet
                            </h3>
                            <p className={`max-w-md ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                Student groups will appear here once they&apos;re created for this project.
                            </p>
                        </div>
                    ) : (
                        <div className={`rounded-xl overflow-hidden shadow ${theme === "dark" ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-gray-200"}`}>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className={`border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                                            <th className="px-6 py-4 text-left font-medium">Group</th>
                                            <th className="px-6 py-4 text-left font-medium">Members</th>
                                            <th className="px-6 py-4 text-left font-medium">Created</th>
                                            <th className="px-6 py-4 text-left font-medium">Status</th>
                                            <th className="px-6 py-4 text-right font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredGroups.map((selection) => {
                                            const uniqueStudents = getUniqueStudents(selection);
                                            return (
                                                <tr
                                                    key={selection.selectionId}
                                                    className={`border-b ${theme === "dark" ? "border-gray-700 hover:bg-gray-800/30" : "border-gray-100 hover:bg-gray-50"}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-medium">Group {selection.selectionId}</p>
                                                            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                                                {uniqueStudents.length} member{uniqueStudents.length !== 1 ? 's' : ''}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex -space-x-2 mr-3">
                                                                {uniqueStudents.slice(0, 4).map((student, index) => (
                                                                    student.profilePic ? (
                                                                        <img
                                                                            key={index}
                                                                            src={student.profilePic}
                                                                            alt={student.username}
                                                                            className="w-8 h-8 rounded-full border-2 object-cover"
                                                                            style={{ borderColor: theme === "dark" ? "#1f2937" : "#f9fafb" }}
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            key={index}
                                                                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${theme === "dark" ? "bg-gray-700 border-gray-800 text-gray-300" : "bg-gray-200 border-gray-50 text-gray-600"}`}
                                                                        >
                                                                            <User className="w-4 h-4" />
                                                                        </div>
                                                                    )
                                                                ))}
                                                            </div>
                                                            {uniqueStudents.length > 4 && (
                                                                <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                                                    +{uniqueStudents.length - 4} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 opacity-70" />
                                                            <span className="text-sm">
                                                                {new Date(selection.joinedAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${selection.isCompleted ?
                                                            (theme === "dark" ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700") :
                                                            (theme === "dark" ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-700")}`}>
                                                            {selection.isCompleted ? (
                                                                <>
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    <span>Completed</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <AlertCircle className="w-4 h-4" />
                                                                    <span>Pending</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => navigate(`/evaluation/${projectId}/${selection.selectionId}`)}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${theme === "dark" ?
                                                                "bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 hover:text-white" :
                                                                "bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700"} shadow-sm`}
                                                        >
                                                            {selection.isCompleted ? "View Results" : "Evaluate"}
                                                            <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                    }
                </div>
            </div>
        </div>
    );
};

AllGroups.propTypes = {
    theme: PropTypes.string.isRequired,
};

export default AllGroups;