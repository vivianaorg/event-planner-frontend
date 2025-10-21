// src/pages/GerenteDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GerenteSidebar from '../gerente/GerenteSidebar';
import './GerenteDashboard.css';

const GerenteDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalEmpleados: 24,
    proyectosActivos: 8,
    tareasPendientes: 15,
    rendimiento: 87
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
  }, [navigate]);

  console.log(user)

  return (
    <div className="gerente-layout">
      <GerenteSidebar />
      
      <div className="gerente-content">
        <header className="gerente-header">
          <div className="user-badge">
            <span className="user-role">Gerente</span>
            <span className="user-email">{user?.correo}</span>
            <div className="user-avatar">GE</div>
          </div>
        </header>

        <main className="gerente-main">
          <div className="welcome-card">
            <h2>Bienvenido, {user?.nombre || user?.name || 'Gerente'}</h2>
            <p>Panel de control y gestión empresarial</p>
          </div>

          <div className="info-section">
            <div className="info-card">
              <h3>📌 Actividades Recientes</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-dot"></span>
                  <div className="activity-info">
                    <p className="activity-text">Actualización de información empresarial</p>
                    <span className="activity-time">Hace 2 horas</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-dot"></span>
                  <div className="activity-info">
                    <p className="activity-text">Nuevo proyecto asignado al equipo</p>
                    <span className="activity-time">Hace 5 horas</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-dot"></span>
                  <div className="activity-info">
                    <p className="activity-text">Revisión de solicitudes pendientes</p>
                    <span className="activity-time">Ayer</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default GerenteDashboard;