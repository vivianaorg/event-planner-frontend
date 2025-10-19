import React, { useState } from 'react';
import styles from './admin.module.css';
import Header from '../../layouts/Header/header';
import Menu from '../../layouts/MenuAdmin/menu';
import Roles from './roles'; // Importar el componente de Roles

const Admin = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Renderizar contenido según la sección activa
  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return (
          <div className={styles.dashboardGrid}>
            {/* Security Status Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <img src={require('../../assets/security-lock.png')} alt="Estado de seguridad" />
                </div>
                <h3 className={styles.cardTitle}>Estado de seguridad</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Roles configurados</span>
                  <span className={styles.metricValue}>8/10</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Usuarios sin asignar</span>
                  <span className={styles.metricValue}>2</span>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <img src={require('../../assets/clock.png')} alt="Actividad reciente" />
                </div>
                <h3 className={styles.cardTitle}>Actividad reciente</h3>
                <button className={styles.viewAllBtn}>
                  Ver Todo
                  <img src={require('../../assets/expand-arrow.png')} alt="Expandir" />
                </button>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.activityItem}>
                  <span className={styles.activityText}>Última Auditoría</span>
                  <span className={styles.activityDate}>07/10/2025</span>
                </div>
              </div>
            </div>

            {/* Affiliations Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <img src={require('../../assets/security.png')} alt="Afiliaciones" />
                </div>
                <h3 className={styles.cardTitle}>Afiliaciones de Empresas</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Pendientes</span>
                  <span className={styles.metricValue}>0</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'roles':
        return <Roles />; // Renderizar el componente de Roles

      case 'usuarios':
        return (
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Gestión de Usuarios</h2>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Usuarios del Sistema</h3>
                <button className={styles.addBtn}>+ Nuevo Usuario</button>
              </div>
              <div className={styles.cardContent}>
                <p>Aquí se mostrará la lista de usuarios</p>
              </div>
            </div>
          </div>
        );

      case 'afiliaciones-pendientes':
        return (
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Afiliaciones Pendientes</h2>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Solicitudes Pendientes de Aprobación</h3>
              </div>
              <div className={styles.cardContent}>
                <p>Aquí se mostrarán las afiliaciones pendientes</p>
              </div>
            </div>
          </div>
        );

      case 'afiliaciones-rechazadas':
        return (
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Afiliaciones Rechazadas</h2>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Solicitudes Rechazadas</h3>
              </div>
              <div className={styles.cardContent}>
                <p>Aquí se mostrarán las afiliaciones rechazadas</p>
              </div>
            </div>
          </div>
        );

      case 'configuracion':
        return (
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Configuración del Sistema</h2>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Configuración General</h3>
              </div>
              <div className={styles.cardContent}>
                <p>Aquí se mostrarán las opciones de configuración</p>
              </div>
            </div>
          </div>
        );

      default:
        return <p>Sección no encontrada</p>;
    }
  };

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar Menu */}
      <div className={styles.sidebar}>
        <Menu 
          onToggle={setIsMenuCollapsed} 
          onSectionChange={setActiveSection}
          activeSection={activeSection}
        />
      </div>
      
      {/* Main Content Area */}
      <div className={`${styles.mainContent} ${isMenuCollapsed ? styles.menuCollapsed : ''}`}>
        {/* Header */}
        <Header />
        
        {/* Dashboard Content */}
        <div className={styles.dashboardContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;