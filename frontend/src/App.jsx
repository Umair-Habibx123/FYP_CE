import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import DotsPreloader from './app/Components/DotsPreLoader/Preloader.jsx';
import NoInternetModal from './app/Components/NoInternetModal/NoInternetModal.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';

// Import all other components
import {
  Welcome_Module,
  HomePage,
  AboutUsPage,
  HowItWorksPage,
  ProjectIdeasPage,
  ContactUsPage,
  PrivacyPolicyPage,
  TermsAndConditionsPage
} from './app/Modules/Welcome_Module/export.js';
import {
  Login_Module,
  LoginPage,
} from './app/Modules/Login_Module/export.js';
import ResetPassword from './app/Modules/Login_Module/components/ResetPassword/ResetPassword.jsx';
import Welcome from './app/Components/Welcome/Welcome.jsx';
import PageNotFound from './app/Components/PageNotFound/PageNotFound.jsx';
import RoleSelection from './app/Components/RoleSelection/RoleSelection.jsx';
import WaitingMessage from './app/Components/WaitingMessage/waitingMessage.jsx';

// Dashboards & User Management
import StudentDashboard from './app/Modules/Student_Module/StudentDashboard.jsx';
import IndustryDashboard from './app/Modules/Industry_Module/IndustryDashboard.jsx';
import TeachersDashboard from './app/Modules/Teacher_Module/TeachersDashboard.jsx';
import AdminDashboard from './app/Modules/Admin_Module/AdminDashboard.jsx';

// Industry & Teacher Modules
import ProjectDetail from './app/Modules/Industry_Module/components/MyProjects/ProjectDetail.jsx';
import ViewSupervision from './app/Modules/Industry_Module/components/TeacherSupervision/ViewSupervision.jsx';
import ApplyForSupervision from "./app/Modules/Teacher_Module/components/ProjectSupervision/ApplyForSupervision.jsx";
import Action from './app/Modules/Teacher_Module/components/PendingApprovals/ApproveProject.jsx';
import AllGroups from './app/Modules/Teacher_Module/components/StudentProgress/AllGroups.jsx';
import Evaluation from './app/Modules/Teacher_Module/components/StudentProgress/Evaluation.jsx';
import AllGroups2 from './app/Modules/Industry_Module/components/StudentProgress/AllGroups.jsx';
import Evaluation2 from './app/Modules/Industry_Module/components/StudentProgress/Evaluation.jsx';

// Student Module
import ProjectSelection from './app/Modules/Student_Module/components/AvailableProjects/ProjectSelection.jsx';
import SubmitDeliverables from './app/Modules/Student_Module/components/SubmitDeliverables/SubmitDeliverables.jsx';
import ViewSubmissions from './app/Modules/Student_Module/components/ViewSubmissions/ViewSubmissions.jsx';
import RatingsOrRemarks from './app/Modules/Student_Module/components/FeedbackRemarks/RatingsOrRemarks.jsx';


// User Management - Admin
import VerifyRepScreen from './app/Modules/Admin_Module/components/UserManagement/VerifyScreens/VerifyRepScreen.jsx';
import VerifyTechScreen from './app/Modules/Admin_Module/components/UserManagement/VerifyScreens/VerifyTechScreen.jsx';
import VerifyStdScreen from './app/Modules/Admin_Module/components/UserManagement/VerifyScreens/VerifyStdScreen.jsx';
import VerifyAdmScreen from './app/Modules/Admin_Module/components/UserManagement/VerifyScreens/VerifyAdmScreen.jsx';
import AddIndustryUser from './app/Modules/Admin_Module/components/UserManagement/AddUserScreens/AddIndustryUser.jsx';
import AddTeacherUser from './app/Modules/Admin_Module/components/UserManagement/AddUserScreens/AddTeacherUser.jsx';
import AddStudentUser from './app/Modules/Admin_Module/components/UserManagement/AddUserScreens/AddStudentUser.jsx';
import AddAdminUser from './app/Modules/Admin_Module/components/UserManagement/AddUserScreens/AddAdminUser.jsx';

// Registration Module
import IndustryRepresentativeRegister from './app/Modules/Registeration_Module/pages/Industry_Rep/IndustryRepSignUp.jsx';
import TeacherRegister from './app/Modules/Registeration_Module/pages/Teachers/TeacherSignUp.jsx';
import StudentRegister from './app/Modules/Registeration_Module/pages/Students/StudentSignUp.jsx';

function App() {
  const [showNoInternetModal, setShowNoInternetModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Function to check network connection
  const handleNetworkChange = () => {
    const online = navigator.onLine;
    setShowNoInternetModal(!online);

    if (!online) {
      setIsLoading(true);
    } else {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };


  useEffect(() => {
    handleNetworkChange();

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    // Simulate app loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust timeout as needed

    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, []);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);
    window.addEventListener("load", handleLoad);

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    handleNetworkChange();
  }, [location]);

  const closeNoInternetModal = () => {
    setShowNoInternetModal(false);
  };

  return (
    <>
      {isLoading ? (
        <DotsPreloader />
      ) : (
        <div className="mt-[70px] md:mt-[90px]">
          <Routes>
            {/* Welcome Module */}
            <Route path="/" element={<Welcome_Module />}>
              <Route index element={<HomePage />} />
              <Route path="about-us" element={<AboutUsPage />} />
              <Route path="how-it-works" element={<HowItWorksPage />} />
              <Route path="project-ideas" element={<ProjectIdeasPage />} />
              <Route path="contact-us" element={<ContactUsPage />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="terms-and-conditions" element={<TermsAndConditionsPage />} />
            </Route>

            {/* Login Module */}
            <Route path="/Login" element={<Login_Module />}>
              <Route index element={<LoginPage />} />
            </Route>
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* General Components */}
            <Route path="/welcome-aboard" element={<Welcome />} />
            <Route path="/roleSelection" element={<RoleSelection />} />
            <Route path="/waitingmessage" element={<WaitingMessage />} />

            {/* Registration */}
            <Route path="/industry-representative-register" element={<IndustryRepresentativeRegister />} />
            <Route path="/teacher-register" element={<TeacherRegister />} />
            <Route path="/student-register" element={<StudentRegister />} />

            {/* Industry Dashboard */}
            <Route element={<ProtectedRoute allowedRoles={["industry"]} />}>
              <Route path="/industry-dashboard" element={<IndustryDashboard />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/teacherSupervision/:projectId" element={<ViewSupervision />} />
              <Route path="/studentProgress/:projectId" element={<AllGroups2 />} />
              <Route path="/evaluating/:projectId/:selectionId" element={<Evaluation2 />} />
            </Route>

            {/* Teacher Dashboard */}
            <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
              <Route path="/teacher-dashboard" element={<TeachersDashboard />} />
              <Route path="/approval/:id" element={<Action />} />
              <Route path="/applySupervision/:id" element={<ApplyForSupervision />} />
              <Route path="/studentProgressStd/:projectId_evaluation" element={<AllGroups />} />
              <Route path="/evaluation/:projectId/:selectionId" element={<Evaluation />} />
            </Route>

            {/* Student Dashboard */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/project-selection/:id" element={<ProjectSelection />} />
              <Route path="/submit-deliverable/:id" element={<SubmitDeliverables />} />
              <Route path="/project-submissions/:id" element={<ViewSubmissions />} />
              <Route path="/RatingsOrRemarks/:projectId/:selectionId" element={<RatingsOrRemarks />} />
            </Route>


            {/* Admin Dashboard */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/editRepScreen/:userId" element={<VerifyRepScreen />} />
              <Route path="/editTechScreen/:userId" element={<VerifyTechScreen />} />
              <Route path="/editStdScreen/:userId" element={<VerifyStdScreen />} />
              <Route path="/editAdmScreen/:userId" element={<VerifyAdmScreen />} />
              <Route path="/add-industry-user" element={<AddIndustryUser />} />
              <Route path="/add-teacher-user" element={<AddTeacherUser />} />
              <Route path="/add-student-user" element={<AddStudentUser />} />
              <Route path="/add-admin" element={<AddAdminUser />} />
            </Route>


            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      )}

      <NoInternetModal isOpen={showNoInternetModal} onClose={closeNoInternetModal} />
    </>
  );
}

export default App;
