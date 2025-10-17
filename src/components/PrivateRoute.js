// src/components/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../components/authService';

const PrivateRoute = ({ children }) => {
  // Verificar si el usuario está autenticado
  if (!isAuthenticated()) {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el componente hijo
  return children;
};

export default PrivateRoute;