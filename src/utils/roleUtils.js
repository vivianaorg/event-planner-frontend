// src/utils/roleUtils.js

/**
 * Verifica si un usuario es administrador
 * @param {Object} user - Objeto usuario del localStorage
 * @returns {boolean} - true si es administrador
 */
export const isAdmin = (user) => {
  if (!user) return false;
  
  const role = user.rol || user.role;
  
  // Verificar diferentes formatos de rol de administrador
  const adminRoles = [
    'admin',
    'administrador', 
    'administrator',
    'Admin',
    'Administrador',
    'ADMIN',
    'ADMINISTRADOR'
  ];
  
  // Verificar si es string o número
  if (typeof role === 'string') {
    return adminRoles.includes(role);
  }
  
  if (typeof role === 'number') {
    // Asumiendo que 1 es admin (ajustar según tu backend)
    return role === 1;
  }
  
  return false;
}; 


/**
 * Obtiene la ruta de redirección según el rol del usuario
 * @param {Object} user - Objeto usuario del localStorage
 * @returns {string} - Ruta de redirección
 */
export const getRedirectPath = (user) => {
  if (isAdmin(user)) return '/admin';

  // Heurística por correo: si el email contiene 'asistente' redirigimos al panel de asistente
  const email = (user?.email || user?.correo || user?.username || '').toString().toLowerCase();
  if (email.includes('asistente')) return '/asistente';

  if (isAsistente(user)) return '/asistente';

  // Fallback: si no es admin ni asistente, ir al dashboard
  return '/dashboard';
};

export const isAsistente = (user) => {
  if (!user) return false;
  // Revisión simple de campos comunes
  const rawRole = user.rol ?? user.role ?? user.tipo ?? user.type ?? '';

  // Si roles viene como array de objetos
  if (Array.isArray(user.roles) && user.roles.length) {
    for (const r of user.roles) {
      const v = (r?.name || r?.role || r?.rol || r || '').toString().toLowerCase();
      if (v.includes('asistente') || v.includes('attend') || v.includes('participant')) return true;
    }
  }

  if (user.asistente) return true;

  // Si rawRole es string o número
  if (typeof rawRole === 'string') {
    const role = rawRole.toLowerCase();
    if (role.includes('asistente') || role.includes('attend') || role.includes('participant')) return true;
  }
  try {
    const dump = JSON.stringify(user).toLowerCase();
    if (dump.includes('asistente') || dump.includes('attendee') || dump.includes('participant')) return true;
  } catch (e) {
    // ignore
  }

  return false;
};

/**
 * Obtiene el nombre del rol formateado
 * @param {Object} user - Objeto usuario del localStorage
 * @returns {string} - Nombre del rol
 */
export const getRoleName = (user) => {
  if (!user) return 'Sin rol';
  
  const role = user.rol || user.role;
  
  if (typeof role === 'string') {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
  
  return `Rol ${role}`;
};

