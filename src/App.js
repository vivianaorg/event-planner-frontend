import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
//import Login from './components/login';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import Admin from './pages/admin/admin';
import Asistente from './pages/asistente/asistente';
import Roles from './pages/admin/roles';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AsistenteRoute from './components/AsistenteRoute';
import Usuarios from './pages/admin/usuarios';
import Empresa from './pages/empresa/empresa';

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

        {/*Gestión de usuarios (subruta de admin)*/}
        <Route
          path="/admin/usuarios"
          element={
            <AdminRoute>
              <Usuarios />
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

        {/*Ruta para empresas*/}
        <Route
          path="/empresa"
          element={
            <PrivateRoute>
              <Empresa />
            </PrivateRoute>
          }
        />

        

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
