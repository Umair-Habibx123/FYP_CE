import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import EditModal from "./Modal/EditModal";
import ErrorModal from "./Modal/ErrorModal"
import Loading from "../../../../Components/loadingIndicator/loading";
import { UNIVERSITY } from "../../../../../constants/constants";
import { CircleX, Download, Edit, Loader2Icon, Save, UserCheck2, UserCircle2 } from 'lucide-react';

const ProfileSetting = ({ theme }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [error, setError] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [profileImage, setProfileImage] = useState(null);
    const [selectedProfilePic, setSelectedProfilePic] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [previousProfilePicUrl, setPreviousProfilePicUrl] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

    const [deletingFile, setDeletingFile] = useState(null); // State for tracking file deletion


    const navigate = useNavigate();


    const handleRemoveFile = (fileName) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    };



    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Filter out files that are already saved or already added
        const newFiles = selectedFiles.filter((file) => {
            // Check if the file is already in the saved attachments
            const isAlreadySaved = selectedStudent?.verificationDocuments?.some(
                (attachment) => attachment.fileName === file.name
            );

            // Check if the file is already in the files list
            const isAlreadyAdded = files.some((f) => f.name === file.name);

            // Only include the file if it's not already saved or added
            return !isAlreadySaved && !isAlreadyAdded;
        });

        // Add the new files to the files state
        if (newFiles.length > 0) {
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        } else {
            alert("Some files are already saved or already added.");
        }
    };

    const showWarning = (message) => {
        setErrorMessage(message); // Set the error message
        setIsErrorModalOpen(true); // Open the modal
    };

    const handleSaveChanges = async () => {
        if (!selectedStudent.studentId || !selectedStudent.yearOfStudy || !selectedStudent.degreeOrProgram || !selectedStudent.university) {
            setIsConfirmationModalOpen(false);
            showWarning("Please fill all required fields.");
            return;
        }

        setLoading(true);

        try {
            // Upload files and get their URLs
            const uploadedFiles = await handleFileUpload(files);

            const updatedStudent = {
                ...selectedStudent,
                verificationDocuments: [
                    ...(selectedStudent.verificationDocuments || []),
                    ...uploadedFiles.map(file => ({
                        fileName: file.fileName,
                        fileUrl: file.fileUrl,
                        uploadedAt: new Date().toISOString()
                    }))
                ]
            };

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/updateStudent/${user.email}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedStudent),
            });

            if (response.ok) {
                alert("Student updated successfully");
                setIsEditModalOpen(false);
                setFiles([]);
                window.location.reload();
            } else {
                console.error("Failed to update teacher");
            }
        } catch (error) {
            console.error("Error updating teacher:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (files) => {
        const uploadedFiles = [];
        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/uploadFile`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const fileData = await response.json();
                uploadedFiles.push({
                    fileName: fileData.fileName,
                    fileUrl: fileData.fileUrl,
                    uploadedAt: new Date().toISOString()
                });
            } else {
                console.error("Failed to upload file:", file.name);
            }
        }
        return uploadedFiles;
    };



    const handleDeleteAttachment = async (fileUrl) => {
        setDeletingFile(fileUrl);

        try {
            // Step 1: Delete the file from storage
            const deleteResponse = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/deletefile`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileUrl }),
            });

            if (!deleteResponse.ok) {
                throw new Error("Failed to delete file");
            }

            const deleteResult = await deleteResponse.json();
            if (!deleteResult.success) {
                throw new Error(deleteResult.message || "Failed to delete file");
            }

            // Step 2: Update the verificationDocuments array
            const updatedDocuments = selectedStudent.verificationDocuments.filter(
                (doc) => doc.fileUrl !== fileUrl
            );

            // Step 3: Send the updated student data to the server
            const updateResponse = await fetch(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/updateStudent/${user.email}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        verificationDocuments: updatedDocuments, // Send only the updated documents array
                    }),
                }
            );

            if (!updateResponse.ok) {
                throw new Error("Failed to update industry");
            }

            const updateResult = await updateResponse.json();
            if (!updateResult.updatedStudent) {
                throw new Error("Failed to update student in the database");
            }

            // Step 4: Update the local state
            setSelectedStudent((prev) => ({
                ...prev,
                verificationDocuments: updatedDocuments,
            }));

            console.log("File deleted and industry updated successfully");
        } catch (error) {
            console.error("Error deleting file or updating industry:", error);
        } finally {
            setDeletingFile(null);
        }
    };



    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/user-profile`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setUser(data);
                setUploadedImageUrl(data.profilePic); // Set profile pic from DB
                setPreviousProfilePicUrl(data.profilePic); // Store the previous profile pic URL
            } catch (error) {
                console.error("Error fetching profile:", error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);



    const handleEdit = (field) => {
        setEditingField(field);
        setFormData({ ...formData, [field]: user[field] || "" });
    };

    const usernameRegex = /^[A-Za-z0-9_]{3,20}$/; // 3-20 characters, no spaces or special chars except "_"
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;

    const handleChange = (e) => {
        setFormData({ ...formData, [editingField]: e.target.value });
    };

    const handleSave = async () => {
        if (editingField === "username" && !usernameRegex.test(formData.username)) {
            setErrorMessage("Invalid username. It should be 3-16 characters long and can contain letters, numbers, underscores, and hyphens.");
            setIsErrorModalOpen(true);
            return;
        }

        if (editingField === "password" && !passwordRegex.test(formData.password)) {
            setErrorMessage("Invalid password. It should be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
            setIsErrorModalOpen(true);
            return;
        }

        setIsSaving(true);
        try {
            // Optimistic update
            const updatedUser = { ...user, [editingField]: formData[editingField] };
            setUser(updatedUser);

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/updateProfile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ [editingField]: formData[editingField] })
            });

            if (!response.ok) throw new Error("Failed to update profile");

            toast.success("Profile updated successfully!");
            setEditingField(null);
        } catch (error) {
            // Revert optimistic update on error
            setUser(user);
            toast.error("Failed to update profile. Please try again.");
            console.error("Update error:", error);
        } finally {
            setIsSaving(false);
        }
    };


    const handleCancel = async () => {
        if (editingField === "username") {
            setEditingField(null);
            return;
        }

        if (editingField === "password") {
            setEditingField(null);
            return;
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file); // Create preview URL
        setProfileImage(previewUrl); // Show image preview
        setSelectedProfilePic(file); // Store file for later upload
    };

    const handleUploadImage = async () => {
        if (!selectedProfilePic) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("profilePic", selectedProfilePic);

        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/uploadProfilePic`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                // Delete the old profile picture if it exists
                if (previousProfilePicUrl) {
                    await deleteProfilePic(previousProfilePicUrl);
                }

                setUploadedImageUrl(data.fileUrl);
                await updateProfilePic(data.fileUrl); // Save new profile pic to DB
                toast.success("Profile picture uploaded successfully!");
                setSelectedProfilePic("");
                navigate(-1)
            } else {
                toast.error("Profile picture upload failed. Please try again.");
                console.error("Profile picture upload failed:", data.error);
            }
        } catch (error) {
            toast.error("Error uploading profile picture. Please try again.");
            console.error("Error uploading profile picture:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const deleteProfilePic = async (fileUrl) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/deletefile`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileUrl }),
            });

            const result = await response.json();
            if (!response.ok) {
                console.error("Failed to delete profile picture:", result.message);
            } else {
                console.log("Profile picture deleted successfully:", result.message);
            }
        } catch (error) {
            console.error("Error deleting profile picture:", error);
        }
    };



    const updateProfilePic = async (imageUrl) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/updateProfile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ profilePic: imageUrl }),
            });

            if (!response.ok) throw new Error("Failed to update profile picture");
            setUser({ ...user, profilePic: imageUrl });
        } catch (error) {
            console.error("Update error:", error);
        }
    };



    if (loading) {
        return (
            <Loading />
        );
    }


    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    return (
        <div
            className={`border-2 border-gray-300 max-w-7xl p-6 sm:p-8 shadow-xl my-16 sm:my-24 rounded-xl mx-auto bg-gradient-to-br ${theme === "dark"
                ? "from-gray-800 to-gray-900 text-white"
                : "from-gray-50 to-white text-gray-800"
                }`}
        >
            <ToastContainer />

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                Profile Settings
            </h2>

            {/* Profile Image and Details */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                {/* Profile Image Section */}
                <div className="relative w-full md:w-1/3 flex flex-col items-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg">
                        {profileImage || uploadedImageUrl ? (
                            <img
                                src={profileImage || uploadedImageUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <UserCircle2 className="w-full h-full text-gray-400" />
                        )}
                    </div>

                    {/* Edit Profile Image Button */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="profilePicInput"
                    />
                    <label
                        htmlFor="profilePicInput"
                        className={`absolute bottom-0 right-0 p-2 rounded-full shadow-md cursor-pointer transition ${theme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-white hover:bg-gray-100"
                            }`}
                    >
                        <Edit className="text-blue-500" />
                    </label>

                    {/* Upload Button */}
                    {selectedProfilePic && (
                        <button
                            onClick={handleUploadImage}
                            disabled={isUploading}
                            className={`mt-4 px-6 py-2 rounded-lg flex items-center justify-center transition ${theme === "dark"
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-blue-500 hover:bg-blue-600"
                                } text-white`}
                        >
                            {isUploading ? (
                                <Loader2Icon className="animate-spin mr-2" />
                            ) : (
                                <Save className="mr-2" />
                            )}
                            {isUploading ? "Uploading..." : "Upload Profile Picture"}
                        </button>
                    )}
                </div>

                {/* User Details Section */}
                <div className="w-full md:w-2/3 space-y-4">
                    {/* Email */}
                    <div className="flex items-center justify-between p-4 rounded-lg shadow-sm bg-opacity-50 backdrop-blur-sm bg-white/10">
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-2 p-4 rounded-lg shadow-sm bg-opacity-50 backdrop-blur-sm bg-white/10">
                        <strong>Status:</strong>
                        <UserCircle2
                            className={
                                user.status === "verified" ? "text-green-500" : "text-red-500"
                            }
                        />
                        <span>{user.status}</span>
                    </div>

                    {/* Username */}
                    <div className="flex items-center justify-between p-4 rounded-lg shadow-sm bg-opacity-50 backdrop-blur-sm bg-white/10">
                        <p>
                            <strong>Username:</strong>{" "}
                            {editingField === "username" ? (
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`border rounded p-2 w-full ${theme === "dark"
                                        ? "bg-gray-800 text-white border-gray-700"
                                        : "bg-white text-black border-gray-300"
                                        }`}
                                />
                            ) : (
                                user.username
                            )}
                        </p>
                        <button
                            onClick={() => handleEdit("username")}
                            className={`p-2 rounded-full shadow-md transition ${theme === "dark"
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            <Edit className="text-blue-500" />
                        </button>
                    </div>

                    {/* Password */}
                    <div className="flex items-center justify-between p-4 rounded-lg shadow-sm bg-opacity-50 backdrop-blur-sm bg-white/10">
                        <p>
                            <strong>Password:</strong>{" "}
                            {editingField === "password" ? (
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`border rounded p-2 w-full ${theme === "dark"
                                        ? "bg-gray-800 text-white border-gray-700"
                                        : "bg-white text-black border-gray-300"
                                        }`}
                                />
                            ) : (
                                "********"
                            )}
                        </p>
                        <button
                            onClick={() => handleEdit("password")}
                            className={`p-2 rounded-full shadow-md transition ${theme === "dark"
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            <Edit className="text-blue-500" />
                        </button>
                    </div>

                    {/* Save and Cancel Buttons */}
                    {editingField && (
                        <div className="flex space-x-4">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`px-6 py-2 rounded-lg flex items-center justify-center transition ${theme === "dark"
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-blue-500 hover:bg-blue-600"
                                    } text-white`}
                            >
                                {isSaving ? (
                                    <Loader2Icon className="animate-spin mr-2" />
                                ) : (
                                    <Save className="mr-2" />
                                )}
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                onClick={handleCancel}
                                className={`px-6 py-2 rounded-lg flex items-center justify-center transition ${theme === "dark"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-red-500 hover:bg-red-600"
                                    } text-white`}
                            >
                                <CircleX className="mr-2" />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Account Info Section */}
            <div
                className={`space-y-4 border-t pt-6 ${theme === "dark" ? "border-gray-700" : "border-gray-300"
                    }`}
            >
                <p className={`${theme === "dark" ? "text-white" : "text-gray-700"}`}>
                    <strong>Role:</strong> {user.role}
                </p>
                <p className={`${theme === "dark" ? "text-white" : "text-gray-700"}`}>
                    <strong>Account Created:</strong>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <p className={`${theme === "dark" ? "text-white" : "text-gray-700"}`}>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(user.updatedAt).toLocaleDateString()}
                </p>
            </div>

            {user.role === "student" && user.studentDetails ? (
                <div className={`mt-8 p-6 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                    {/* Student Details Section */}
                    <div className={`mb-6 p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Student Details</h3>
                            {/* Edit Button (Only if not verified) */}
                            {!user.studentDetails.verified && (
                                <button
                                    onClick={() => {
                                        setSelectedStudent(user.studentDetails);
                                        setIsEditModalOpen(true);
                                    }}
                                    className={`p-2 rounded-full ${theme === "dark" ? "text-yellow-400 hover:bg-gray-700" : "text-yellow-600 hover:bg-gray-100"} transition-all`}
                                    title="Edit Student Details"
                                >
                                    <Edit className="text-2xl" />
                                </button>
                            )}
                        </div>

                        {/* Verified Status Icon */}
                        <div className="mb-6">
                            {user.studentDetails.verified ? (
                                <div className="flex items-center gap-2 text-green-500">
                                    <UserCheck2 className="text-xl" />
                                    <span className="font-semibold">Verified</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-500">
                                    <CircleX className="text-xl" />
                                    <span className="font-semibold">Not Verified</span>
                                </div>
                            )}
                        </div>

                        {/* Student Details */}
                        <div className="space-y-4">
                            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                <strong className="font-semibold">Student ID:</strong> {user.studentDetails.studentId}
                            </p>
                            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                <strong className="font-semibold">Degree / Program:</strong> {user.studentDetails.degreeOrProgram}
                            </p>
                            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                <strong className="font-semibold">Year Of Study:</strong> {user.studentDetails.yearOfStudy}
                            </p>
                            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                <strong className="font-semibold">University:</strong> {user.studentDetails.university}
                            </p>
                            {user.studentDetails.verified && (
                                <>
                                    <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                        <strong className="font-semibold">Verified At:</strong> {new Date(user.studentDetails.verifiedAt).toLocaleString()}
                                    </p>
                                    <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                        <strong className="font-semibold">Verified By:</strong> {user.studentDetails.verifiedBy}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Verification Documents Section */}
                    <div className={`mt-8 p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl`}>
                        <h3 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Verification Documents</h3>
                        {user.studentDetails.verificationDocuments?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {user.studentDetails.verificationDocuments.map((doc, index) => (
                                    <div key={index} className={`p-6 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} rounded-lg transition-all duration-300 hover:scale-105`}>
                                        <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                            <strong className="font-semibold">File Name:</strong> {doc.fileName}
                                        </p>
                                        <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                            <strong className="font-semibold">Uploaded At:</strong> {new Date(doc.uploadedAt).toLocaleString()}
                                        </p>
                                        <a
                                            href={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}${doc.fileUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`mt-4 inline-block ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"} transition-all`}
                                        >
                                            <i className="text-lg"><Download size={20} /></i>
                                            Download File
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>No verification documents uploaded.</p>
                        )}
                    </div>
                </div>
            ) : null}



            <EditModal
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                theme={theme}
                selectedStudent={selectedStudent}
                setSelectedStudent={setSelectedStudent}
                UNIVERSITY={UNIVERSITY}
                handleDeleteAttachment={handleDeleteAttachment}
                deletingFile={deletingFile}
                files={files}
                handleFileChange={handleFileChange}
                handleRemoveFile={handleRemoveFile}
                isConfirmationModalOpen={isConfirmationModalOpen}
                setIsConfirmationModalOpen={setIsConfirmationModalOpen}
                handleSaveChanges={handleSaveChanges}
                loading={loading}
            />



            <div>
                {/* Other UI Elements */}
                <ErrorModal
                    isOpen={isErrorModalOpen}
                    message={errorMessage}
                    onClose={() => setIsErrorModalOpen(false)}
                    theme={theme}
                />
            </div>
        </div >
    );


};

ProfileSetting.propTypes = {
    theme: PropTypes.string.isRequired,
};


export default ProfileSetting;