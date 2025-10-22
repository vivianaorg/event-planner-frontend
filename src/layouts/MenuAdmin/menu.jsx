import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './menu.module.css';

import securityIcon from '../../assets/security.png';
import settingsIcon from '../../assets/settings.png';
import personIcon from '../../assets/person.png';
import hamburgerIcon from '../../assets/hamburgerIcon.png';
import expandIcon from '../../assets/expand-arrow.png';
import dashboardIcon from '../../assets/dashboardIcon.png';
import logoIcon from '../../assets/evento-remove.png';

const Menu = ({ onToggle, onSectionChange, activeSection }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    seguridad: false, 
    afiliaciones: false,
    configuracion: false
  });

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: dashboardIcon,
      hasSubmenu: false
    },
    {
      id: 'seguridad',
      label: 'Seguridad',
      icon: securityIcon,
      hasSubmenu: true,
      submenu: [
        { id: 'roles', label: 'Roles' },
        { id: 'usuarios', label: 'Usuarios' }
      ]
    },
    {
      id: 'afiliaciones',
      label: 'Afiliaciones',
      icon: personIcon,
      hasSubmenu: true,
      submenu: [
        { id: 'afiliaciones-pendientes', label: 'Afiliaciones Pendientes' },
        { id: 'afiliaciones-aprobadas', label: 'Afiliaciones Aprobadas' },
        { id: 'afiliaciones-rechazadas', label: 'Afiliaciones Rechazadas' }
      ]
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: settingsIcon,
      hasSubmenu: false
    }
  ];

  const toggleMenu = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const toggleSubmenu = (menuId) => {
    if (!isCollapsed) {
      setExpandedMenus(prev => ({
        ...prev,
        [menuId]: !prev[menuId]
      }));
    }
  };

  const handleMenuClick = (item) => {
    if (item.hasSubmenu && !isCollapsed) {
      toggleSubmenu(item.id);
    } else if (!item.hasSubmenu) {
      if (onSectionChange) {
        onSectionChange(item.id);
      }
    }
  };

  const handleSubmenuClick = (submenuItem) => {
    if (onSectionChange) {
      onSectionChange(submenuItem.id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (id) => {
    return activeSection === id;
  };

  const isSubmenuActive = (submenuItems) => {
    return submenuItems?.some(item => activeSection === item.id);
  };

  const renderIcon = (icon) => {
    return (
      <img 
        className={styles.menuIcon} 
        src={icon} 
        alt="menu icon"
        onError={(e) => {
          console.error('Error cargando icono:', icon);
          e.target.style.display = 'none';
        }}
      />
    );
  };

  return (
    <div className={`${styles.rectangleParent} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.groupChild} />
      
      {/* Botón para colapsar/expandir */}
      <button 
        className={styles.hamburgerIcon} 
        onClick={toggleMenu} 
        title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
      >
        <img 
          src={hamburgerIcon} 
          alt="menu toggle"
          onError={(e) => {
            e.target.style.display = 'none';
            const parent = e.target.parentElement;
            if (!parent.querySelector('.fallbackHamburger')) {
              const fallback = document.createElement('div');
              fallback.className = 'fallbackHamburger';
              fallback.innerHTML = `
                <div style="width: 20px; height: 2px; background: white; margin: 4px 0;"></div>
                <div style="width: 20px; height: 2px; background: white; margin: 4px 0;"></div>
                <div style="width: 20px; height: 2px; background: white; margin: 4px 0;"></div>
              `;
              parent.appendChild(fallback);
            }
          }}
        />
      </button>

      {/* Logo siempre visible */}
      <div className={styles.logoSection}>
        {!isCollapsed ? (
          <div className={styles.panelDeAdministracin}>Panel de Administración</div>
        ) : (
          <img 
            src={logoIcon} 
            alt="Event Planner" 
            className={styles.logoCollapsed}
          />
        )}
      </div>

      {/* Menu Items */}
      <div className={styles.menuContainer}>
        {menuItems.map((item) => (
          <div key={item.id} className={styles.menuItem}>
            <div 
              className={`${styles.menuItemContent} ${
                isActive(item.id) || (item.hasSubmenu && isSubmenuActive(item.submenu)) 
                  ? styles.activeMenuItem 
                  : ''
              }`}
              onClick={() => handleMenuClick(item)}
              title={isCollapsed ? item.label : ''}
            >
              {renderIcon(item.icon)}
              {!isCollapsed && (
                <>
                  <span className={styles.menuLabel}>{item.label}</span>
                  {item.hasSubmenu && (
                    <div className={`${styles.expandIcon} ${expandedMenus[item.id] ? styles.expanded : ''}`}>
                      <img 
                        src={expandIcon} 
                        alt="expand" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.textContent = '▼';
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {item.hasSubmenu && expandedMenus[item.id] && !isCollapsed && (
              <div className={styles.submenu}>
                {item.submenu.map((subItem) => (
                  <div
                    key={subItem.id}
                    className={`${styles.submenuItem} ${isActive(subItem.id) ? styles.activeSubmenuItem : ''}`}
                    onClick={() => handleSubmenuClick(subItem)}
                  >
                    {subItem.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botón de Cerrar Sesión */}
      <button 
        className={styles.logoutButton}
        onClick={handleLogout}
        title="Cerrar Sesión"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.logoutIcon}>
          <path d="M13 3h3a2 2 0 012 2v10a2 2 0 01-2 2h-3M8 16l-5-5 5-5M3 11h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {!isCollapsed && <span>Cerrar Sesión</span>}
      </button>
    </div>
  );
};

export default Menu;