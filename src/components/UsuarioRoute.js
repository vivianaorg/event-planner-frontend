import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const UsuarioRoute = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener el token del localStorage
  const getToken = () => {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  };

  // Configurar headers con el token
  const getHeaders = () => {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  // Manejar respuestas de fetch
  const handleResponse = async (response) => {
    if (!response.ok) {
      // Si hay error de autenticación, limpiar token
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
      }
      
      // Intentar obtener mensaje de error del backend
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      } catch {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    return response.json();
  };

  // Obtener todos los usuarios
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/gestion-usuarios/users`, {
        method: 'GET',
        headers: getHeaders(),
      });

      const result = await handleResponse(response);

      let usuariosData = [];
      
      if (result) {
        if (result.data && Array.isArray(result.data)) {
          usuariosData = result.data;
        } 
        else if (Array.isArray(result)) {
          usuariosData = result;
        }
        else if (result.usuarios && Array.isArray(result.usuarios)) {
          usuariosData = result.usuarios;
        }
      }
      
      // Mapear los campos del backend al frontend
      const usuariosMapeados = usuariosData.map(usuario => ({
        id: usuario.id,
        nombre: usuario.nombre || '',
        cedula: usuario.cedula || '',
        telefono: usuario.telefono || '',
        email: usuario.correo || usuario.email || '',
        correo: usuario.correo || usuario.email || '',
        // Mapear el rol
        rol: usuario.rol || 'N/A',
        // Mapear la empresa desde rol_data
        empresa: usuario.rol_data?.empresa_nombre || 'N/A',
        // Datos adicionales del rol
        rol_id: usuario.rol_id,
        rol_data: usuario.rol_data
      }));
      
      console.log('Respuesta completa del backend:', result);
      console.log('Usuarios procesados:', usuariosMapeados);
      
      setUsuarios(usuariosMapeados);
      setFilteredUsuarios(usuariosMapeados);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError(err.message || 'Error al cargar usuarios');
      setUsuarios([]);
      setFilteredUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const createUsuario = async (usuarioData) => {
    try {
      // Preparar datos según lo que espera el backend
      const dataParaBackend = {
        nombre: usuarioData.nombre,
        cedula: usuarioData.cedula || usuarioData.numeroDocumento,
        telefono: usuarioData.telefono,
        correo: usuarioData.email || usuarioData.correo,
        contraseña: usuarioData.contraseña || 'temporal123', // Contraseña temporal
        rol: usuarioData.rol,
        roleData: {}
      };

      // Si es gerente u organizador, agregar empresa_id
      if (usuarioData.rol === 'gerente' || usuarioData.rol === 'organizador') {
        if (usuarioData.empresa_id) {
          dataParaBackend.roleData = {
            empresa_id: usuarioData.empresa_id
          };
        }
      }

      // Si es ponente, agregar especialidad
      if (usuarioData.rol === 'ponente' && usuarioData.especialidad) {
        dataParaBackend.roleData = {
          especialidad: usuarioData.especialidad
        };
      }
      
      const response = await fetch(`${API_URL}/api/gestion-usuarios/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dataParaBackend),
      });

      const result = await handleResponse(response);
      await fetchUsuarios(); // Recargar lista
      
      return { 
        success: true, 
        data: result.data || result 
      };
    } catch (err) {
      console.error('Error al crear usuario:', err);
      return { 
        success: false, 
        error: err.message || 'Error al crear usuario' 
      };
    }
  };

  // Actualizar usuario
  const updateUsuario = async (id, usuarioData) => {
    try {
      const response = await fetch(`${API_URL}/api/gestion-usuarios/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(usuarioData),
      });

      const data = await handleResponse(response);
      await fetchUsuarios(); // Recargar lista
      return { success: true, data };
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      return { 
        success: false, 
        error: err.message || 'Error al actualizar usuario' 
      };
    }
  };

  // Eliminar usuario
  const deleteUsuario = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/gestion-usuarios/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      await handleResponse(response);
      await fetchUsuarios(); // Recargar lista
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      return { 
        success: false, 
        error: err.message || 'Error al eliminar usuario' 
      };
    }
  };

  // Obtener un usuario por ID
  const getUsuarioById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/gestion-usuarios/users/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      const data = await handleResponse(response);
      return { success: true, data };
    } catch (err) {
      console.error('Error al obtener usuario:', err);
      return { 
        success: false, 
        error: err.message || 'Error al obtener usuario' 
      };
    }
  };

  // Filtrar usuarios por búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
    
    // Asegurarse de que usuarios sea un array
    const usuariosArray = Array.isArray(usuarios) ? usuarios : [];
    
    if (!term.trim()) {
      setFilteredUsuarios(usuariosArray);
      return;
    }

    const filtered = usuariosArray.filter(usuario => 
      usuario.nombre?.toLowerCase().includes(term.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(term.toLowerCase()) ||
      usuario.correo?.toLowerCase().includes(term.toLowerCase()) ||
      usuario.empresa?.toLowerCase().includes(term.toLowerCase()) ||
      usuario.rol?.toLowerCase().includes(term.toLowerCase()) ||
      usuario.cedula?.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredUsuarios(filtered);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return {
    usuarios: filteredUsuarios,
    allUsuarios: usuarios,
    loading,
    error,
    searchTerm,
    fetchUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuarioById,
    handleSearch
  };
};

export default UsuarioRoute;