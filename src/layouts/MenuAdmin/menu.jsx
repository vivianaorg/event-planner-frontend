import React, { useState } from 'react';
import styles from './menu.module.css';

import securityIcon from '../../assets/security.png';
import settingsIcon from '../../assets/settings.png';
import personIcon from '../../assets/person.png';
import hamburgerIcon from '../../assets/hamburgerIcon.png';
import expandIcon from '../../assets/expand-arrow.png';
import dashboardIcon from '../../assets/dashboardIcon.png';

const Menu = ({ onToggle, onSectionChange, activeSection }) => {
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
      // Cambiar sección sin navegar
      if (onSectionChange) {
        onSectionChange(item.id);
      }
    }
  };

  const handleSubmenuClick = (submenuItem) => {
    // Cambiar sección sin navegar
    if (onSectionChange) {
      onSectionChange(submenuItem.id);
    }
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
            // Fallback: crear icono hamburguesa con divs
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

      {/* Logo/Header */}
      {!isCollapsed && (
        <div className={styles.logoSection}>
          <div className={styles.panelDeAdministracin}>Panel de Administración</div>
        </div>
      )}

      {/* Menu Items */}
      <div className={styles.menuContainer}>
        {menuItems.map((item) => (
          <div key={item.id} className={styles.menuItem}>
            {/* Main Menu Item */}
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

            {/* Submenu */}
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
    </div>
  );
};

export default Menu;