// src/components/GerenteSidebar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './GerenteSidebar.css';
import dashboardIcon from '../../assets/dashboardIcon.png';
import empresa from '../../assets/person.png';
import triangulo from '../../assets/expand-arrow.png';
import campana from '../../assets/notifications.png';
import settings from '../../assets/settings.png';
import logo from '../../assets/evento-remove - copia.png';

const GerenteSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [empresaOpen, setEmpresaOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="gerente-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logo} alt="logo"/>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${isActive('/gerente') ? 'active' : ''}`}
          onClick={() => navigate('/gerente')}
        >
          <img src={dashboardIcon} alt="Dashboard Icon" />
          <span className="nav-text">Dashboard</span>
        </button>

        <div className="nav-group">
          <button
            className={`nav-item ${empresaOpen ? 'open' : ''}`}
            onClick={() => setEmpresaOpen(!empresaOpen)}
          >
            <img src={empresa} alt="Empresa Icon" />
            <span className="nav-text">Empresa</span>
            <img src={triangulo} alt="Triangulo Icon" />
          </button>

          {empresaOpen && (
            <div className="subnav">
              <button
                className={`subnav-item ${isActive('/gerente/actualizar-empresa') ? 'active' : ''}`}
                onClick={() => navigate('/gerente/actualizar-empresa')}
              >
                Actualizar Información
              </button>
            </div>
          )}
        </div>

        <button
          className={`nav-item ${isActive('/gerente/solicitudes') ? 'active' : ''}`}
          onClick={() => navigate('/gerente/solicitudes')}
        >
          <img src={campana} alt="Dashboard Icon" />
          <span className="nav-text">Mis solicitudes</span>
        </button>

        <button
          className={`nav-item ${isActive('/gerente/configuracion') ? 'active' : ''}`}
          onClick={() => navigate('/gerente/configuracion')}
        >
          <img src={settings} alt="Dashboard Icon" />
          <span className="nav-text">Configuración</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default GerenteSidebar;