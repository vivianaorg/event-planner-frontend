import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import { isAdmin } from '../utils/roleUtils';

const AdminRoute = ({ children }) => {
  // Verificar si el usuario está autenticado
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Obtener información del usuario
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Verificar si es administrador
  if (!isAdmin(user)) {
    // Si no es admin, redirigir al dashboard normal
    return <Navigate to="/dashboard" replace />;
  }

  // Si es admin, mostrar el componente hijo
  return children;
};

export default AdminRoute;
