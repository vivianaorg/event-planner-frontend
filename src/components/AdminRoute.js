import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import { isAdmin } from '../utils/roleUtils';

const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!isAdmin(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
