import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
//import Login from './components/login';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import Admin from './pages/admin/admin';
import Asistente from './pages/asistente/asistente';
import Roles from './pages/Roles';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AsistenteRoute from './components/AsistenteRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Ruta del panel de administración */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        {/* Gestión de roles (subruta de admin) */}
        <Route
          path="/admin/roles"
          element={
            <AdminRoute>
              <Roles />
            </AdminRoute>
          }
        />

        {/* Ruta para asistentes */}
        <Route
          path="/asistente"
          element={
            <AsistenteRoute>
              <Asistente />
            </AsistenteRoute>
          }
        />

        {/*Gestion de roles (subruta de asistente)*/}
        

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
