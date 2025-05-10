import PropTypes from 'prop-types';
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import Preloader from "../app/Components/DotsPreLoader/Preloader.jsx";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <Preloader />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};


ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(
    PropTypes.oneOf(['student', 'teacher', 'industry', 'admin']) 
  ).isRequired
};

ProtectedRoute.defaultProps = {
  allowedRoles: [] 
};

export default ProtectedRoute;