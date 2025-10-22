import useUsuarios from '../../components/UsuarioRoute';
import styles from './usuarios.module.css';
import { useState, useEffect } from 'react';

const Usuarios = () => {
  const {
    usuarios,
    loading,
    error,
    searchTerm,
    handleSearch,
    fetchUsuarios
  } = useUsuarios();

  const [filterBy, setFilterBy] = useState('todas');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [credencialesUsuario, setCredencialesUsuario] = useState(null);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    numeroDocumento: '',
    telefono: '',
    email: '',
    rol: '',
    empresa: '',
    especialidad: ''
  });

  const rolesDelSistema = [
    { id: 2, nombre: 'Gerente', tipo: 'gerente' },
    { id: 3, nombre: 'Organizador', tipo: 'organizador' },
    { id: 4, nombre: 'Ponente', tipo: 'ponente' },
    { id: 5, nombre: 'Asistente', tipo: 'asistente' }
  ];

  useEffect(() => {
    if (showCreateModal || showEditModal) {
      fetchEmpresas();
    }
  }, [showCreateModal, showEditModal]);

  // Función para obtener el nombre de la empresa
  const obtenerNombreEmpresa = (usuario) => {
    if (usuario.rol_data?.empresa_nombre) {
      return usuario.rol_data.empresa_nombre;
    }
    if (usuario.empresa && usuario.empresa !== 'N/A') {
      return usuario.empresa;
    }
    return 'N/A';
  };

  // Obtener empresas aprobadas
  const fetchEmpresas = async () => {
    setLoadingEmpresas(true);
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        console.error('No hay token de autenticación');
        setEmpresas([]);
        return;
      }

      const response = await fetch('http://localhost:3000/api/empresas?incluir_pendientes=true', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.error('Sesión expirada');
        setEmpresas([]);
        return;
      }

      if (response.ok) {
        const result = await response.json();

        if (result.success && result.data) {
          const empresasAprobadas = result.data.filter(e => e.estado === 1);
          setEmpresas(empresasAprobadas);
        } else {
          setEmpresas([]);
        }
      } else {
        console.error('Error al cargar empresas');
        setEmpresas([]);
      }
    } catch (error) {
      console.error('Error al cargar empresas:', error);
      setEmpresas([]);
    } finally {
      setLoadingEmpresas(false);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      apellidos: '',
      numeroDocumento: '',
      telefono: '',
      email: '',
      rol: '',
      empresa: '',
      especialidad: ''
    });
  };

  // VER USUARIO - Usando PUT /profile
  const handleViewUser = async (usuario) => {
    setLoadingAction(true);
    setSelectedUsuario(null);

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        alert('No hay sesión activa. Por favor inicia sesión nuevamente.');
        setLoadingAction(false);
        return;
      }

      // Usar PUT /profile enviando los datos actuales para obtener la respuesta completa
      const response = await fetch(`http://localhost:3000/api/gestion-usuarios/${usuario.id}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: usuario.nombre,
          telefono: usuario.telefono || usuario.telefono,
          correo: usuario.correo || usuario.email
        })
      });

      if (response.status === 401) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        setLoadingAction(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar información del usuario');
      }

      const result = await response.json();

      if (result.success && result.data) {
        console.log('========== USUARIO CARGADO CON /profile ==========');
        console.log('Usuario completo:', result.data);
        console.log('Estado (activo):', result.data.activo, 'Tipo:', typeof result.data.activo);
        console.log('==================================================');

        setSelectedUsuario(result.data);
        setShowViewModal(true);
      } else {
        alert('No se pudo cargar la información del usuario');
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      alert(`Error al cargar información del usuario: ${error.message}`);
    } finally {
      setLoadingAction(false);
    }
  };

  // EDITAR USUARIO - Cargar datos
  const handleEditUser = async (usuario) => {
    setLoadingAction(true);
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        alert('No hay sesión activa. Por favor inicia sesión nuevamente.');
        setLoadingAction(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/api/gestion-usuarios/${usuario.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        setLoadingAction(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar información del usuario');
      }

      const result = await response.json();

      if (result.success && result.data) {
        const userData = result.data;

        // Separar nombre y apellidos si es necesario
        const nombreCompleto = userData.nombre || '';
        const partesNombre = nombreCompleto.trim().split(' ');
        const nombre = partesNombre[0] || '';
        const apellidos = partesNombre.slice(1).join(' ') || '';

        setFormData({
          nombre: nombre,
          apellidos: apellidos,
          numeroDocumento: userData.cedula || '',
          telefono: userData.telefono || '',
          email: userData.correo || '',
          rol: userData.rol || '',
          empresa: userData.rol_data?.empresa_id || '',
          especialidad: userData.rol_data?.especialidad || ''
        });

        setSelectedUsuario(userData);
        setShowEditModal(true);
      } else {
        alert('Error al cargar información del usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al cargar información del usuario: ${error.message}`);
    } finally {
      setLoadingAction(false);
    }
  };

  // EDITAR USUARIO - Guardar cambios usando PUT /profile
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoadingAction(true);

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        alert('No hay sesión activa. Por favor inicia sesión nuevamente.');
        setLoadingAction(false);
        return;
      }

      const updateData = {
        nombre: `${formData.nombre} ${formData.apellidos}`.trim(),
        telefono: formData.telefono,
        correo: formData.email
      };

      const response = await fetch(`http://localhost:3000/api/gestion-usuarios/${selectedUsuario.id}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.status === 401) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        setLoadingAction(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar usuario');
      }

      const result = await response.json();

      if (result.success) {
        alert('Usuario actualizado exitosamente');

        // La respuesta de /profile ya incluye todos los datos actualizados con el campo 'activo'
        if (result.data) {
          console.log('Usuario actualizado con /profile:', result.data);
          console.log('Estado activo:', result.data.activo);
          setSelectedUsuario(result.data);
        }

        setShowEditModal(false);
        resetForm();
        fetchUsuarios(); // Recargar lista
      } else {
        alert(result.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al actualizar usuario: ${error.message}`);
    } finally {
      setLoadingAction(false);
    }
  };

  // Crear usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        alert('No hay sesión activa. Por favor inicia sesión nuevamente.');
        return;
      }

      const requestBody = {
        nombre: `${formData.nombre} ${formData.apellidos}`,
        cedula: formData.numeroDocumento,
        correo: formData.email,
        telefono: formData.telefono,
        rol: formData.rol
      };

      if (formData.empresa && !isNaN(parseInt(formData.empresa))) {
        requestBody.id_empresa = parseInt(formData.empresa);
      }

      if (formData.rol === 'ponente' && formData.especialidad) {
        requestBody.especialidad = formData.especialidad;
      }

      const response = await fetch('http://localhost:3000/api/auth/crear-usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setCredencialesUsuario({
          nombre: result.data.nombre,
          correo: result.data.correo,
          rol: result.data.rol,
          empresa: result.data.empresa?.nombre || 'N/A',
          mensaje: result.message
        });

        setShowCreateModal(false);
        setShowPasswordModal(true);
        resetForm();
        fetchUsuarios();
      } else {
        alert(result.message || 'Error al crear usuario. Por favor verifica los datos.');
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  // DESACTIVAR/ACTIVAR usuario (Toggle Status) - Solo desde modal de visualización
  const handleToggleStatus = async (id, nombre, estadoActual) => {
    const estadoActualNumerico = estadoActual === true || estadoActual === 1 ? 1 : 0;
    const nuevoEstado = estadoActualNumerico === 1 ? 0 : 1;
    const accion = estadoActualNumerico === 1 ? 'desactivar' : 'activar';
    const mensaje = estadoActualNumerico === 1
      ? `¿Estás seguro de desactivar al usuario ${nombre}?`
      : `¿Estás seguro de activar al usuario ${nombre}?`;

    if (window.confirm(mensaje)) {
      setLoadingAction(true);

      try {
        const token = localStorage.getItem('access_token');

        if (!token) {
          alert('No hay sesión activa. Por favor inicia sesión nuevamente.');
          setLoadingAction(false);
          return;
        }

        const response = await fetch(`http://localhost:3000/api/gestion-usuarios/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ activo: nuevoEstado })
        });

        if (response.status === 401) {
          alert('Sesión expirada. Por favor inicia sesión nuevamente.');
          setLoadingAction(false);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error al ${accion} usuario`);
        }

        const result = await response.json();

        if (result.success) {
          alert(result.message || `Usuario ${accion === 'desactivar' ? 'desactivado' : 'activado'} exitosamente`);

          await fetchUsuarios();

          // Actualizar datos del usuario en el modal usando /profile
          if (selectedUsuario && selectedUsuario.id === id) {
            const profileResponse = await fetch(`http://localhost:3000/api/gestion-usuarios/${id}/profile`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                nombre: selectedUsuario.nombre,
                telefono: selectedUsuario.telefono,
                correo: selectedUsuario.correo
              })
            });

            if (profileResponse.ok) {
              const profileResult = await profileResponse.json();
              if (profileResult.success && profileResult.data) {
                console.log('========== DATOS ACTUALIZADOS ==========');
                console.log('Usuario actualizado:', profileResult.data);
                console.log('Nuevo estado (activo):', profileResult.data.activo);
                console.log('=======================================');

                // Forzar actualización limpia
                setSelectedUsuario(null);
                setTimeout(() => {
                  setSelectedUsuario(profileResult.data);
                }, 0);
              }
            }
          }
        } else {
          alert(result.message || `Error al ${accion} usuario`);
        }
      } catch (error) {
        console.error(`Error al ${accion} usuario:`, error);
        alert(`Error al ${accion} usuario: ${error.message}`);
      } finally {
        setLoadingAction(false);
      }
    }
  };

  // Filtrar usuarios según el filtro seleccionado
  const getFilteredUsers = () => {
    const usuariosArray = Array.isArray(usuarios) ? usuarios : [];
    if (filterBy === 'todas') return usuariosArray;
    return usuariosArray.filter(user => user.rol?.toLowerCase() === filterBy.toLowerCase());
  };

  const filteredUsers = getFilteredUsers();

  if (loading) {
    return (
      <div className={styles.usuariosContainer}>
        <div className={styles.loadingSpinner}>Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.usuariosContainer}>
        <div className={styles.errorMessage}>
          <p>Error: {error}</p>
          <button onClick={fetchUsuarios} className={styles.btnRetry}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.usuariosContainer}>
      <div className={styles.usuariosHeader}>
        <h1 className={styles.usuariosTitle}>Usuarios</h1>
        <button
          className={styles.btnCrearUsuario}
          onClick={() => setShowCreateModal(true)}
        >
          + Crear Usuarios
        </button>
      </div>

      <div className={styles.usuariosCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Listado de Usuarios</h2>

          <div className={styles.headerControls}>
            <div className={styles.searchContainer}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className={styles.filterContainer}>
              <label htmlFor="filter-select">Filtrar por:</label>
              <select
                id="filter-select"
                className={styles.filterSelect}
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="todas">Mostrar todas</option>
                <option value="gerente">Gerente</option>
                <option value="ponente">Ponente</option>
                <option value="organizador">Organizador</option>
                <option value="asistente">Asistente</option>
              </select>
              <svg className={styles.filterIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.usuariosTable}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Empresa</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.noResults}>
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nombre || 'N/A'}</td>
                    <td>{usuario.cedula || 'N/A'}</td>
                    <td>{usuario.email || usuario.correo || 'N/A'}</td>
                    <td>{usuario.telefono || 'N/A'}</td>
                    <td>{obtenerNombreEmpresa(usuario)}</td>
                    <td>
                      <div className={styles.rolCell}>
                        <span className={styles.rolBadge}>
                          {usuario.rol ? usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1) : 'N/A'}
                        </span>
                        <div className={styles.actionIcons}>
                          <button
                            className={styles.iconBtn}
                            title="Ver"
                            onClick={() => handleViewUser(usuario)}
                            disabled={loadingAction}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M8 3C4.5 3 1.7 5.6 1 8c.7 2.4 3.5 5 7 5s6.3-2.6 7-5c-.7-2.4-3.5-5-7-5zm0 8a3 3 0 110-6 3 3 0 010 6z" />
                            </svg>
                          </button>
                          <button
                            className={styles.iconBtn}
                            title="Editar"
                            onClick={() => handleEditUser(usuario)}
                            disabled={loadingAction}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M11.5 1.5l3 3-9 9H2.5v-3l9-9zm1.4-.4a1 1 0 011.4 0l1.6 1.6a1 1 0 010 1.4l-1.1 1-3-3 1.1-1z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal VER USUARIO */}
      {showViewModal && selectedUsuario && (
        <div className={styles.modalOverlay} onClick={() => setShowViewModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.userIcon} style={{ backgroundColor: '#2196f3' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className={styles.modalTitle}>Información del Usuario</h3>
              <button className={styles.closeBtn} onClick={() => setShowViewModal(false)}>×</button>
            </div>

            <div className={styles.modalForm} style={{ padding: '20px' }}>
              {/* Estado del Usuario - Banner superior */}
              <div style={{
                marginBottom: '20px',
                padding: '12px 16px',
                backgroundColor: selectedUsuario.activo === 1 || selectedUsuario.activo === true ? '#e8f5e9' : '#ffebee',
                border: `1px solid ${selectedUsuario.activo === 1 || selectedUsuario.activo === true ? '#4caf50' : '#f44336'}`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: selectedUsuario.activo === 1 || selectedUsuario.activo === true ? '#4caf50' : '#f44336'
                  }} />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: selectedUsuario.activo === 1 || selectedUsuario.activo === true ? '#2e7d32' : '#c62828'
                  }}>
                    Estado: {selectedUsuario.activo === 1 || selectedUsuario.activo === true ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                {(selectedUsuario.activo === 0 || selectedUsuario.activo === false) && (
                  <span style={{ fontSize: '12px', color: '#c62828', fontStyle: 'italic' }}>
                    Usuario desactivado
                  </span>
                )}
              </div>

              {/* Información Personal */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Información Personal
                </h4>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Nombre Completo</label>
                    <input
                      type="text"
                      value={selectedUsuario.nombre || 'N/A'}
                      disabled
                      readOnly
                      style={{
                        backgroundColor: '#f5f5f5',
                        cursor: 'default',
                        color: '#333',
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Número de Documento</label>
                    <input
                      type="text"
                      value={selectedUsuario.cedula || 'N/A'}
                      disabled
                      readOnly
                      style={{
                        backgroundColor: '#f5f5f5',
                        cursor: 'default',
                        color: '#333',
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Teléfono</label>
                    <input
                      type="text"
                      value={selectedUsuario.telefono || 'N/A'}
                      disabled
                      readOnly
                      style={{
                        backgroundColor: '#f5f5f5',
                        cursor: 'default',
                        color: '#333',
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    value={selectedUsuario.correo || 'N/A'}
                    disabled
                    readOnly
                    style={{
                      backgroundColor: '#f5f5f5',
                      cursor: 'default',
                      color: '#333',
                      border: '1px solid #e0e0e0'
                    }}
                  />
                </div>
              </div>

              {/* Información del Sistema */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Información del Sistema
                </h4>

                <div className={styles.formGroup}>
                  <label>Rol Asignado</label>
                  <input
                    type="text"
                    value={selectedUsuario.rol ? selectedUsuario.rol.charAt(0).toUpperCase() + selectedUsuario.rol.slice(1) : 'N/A'}
                    disabled
                    readOnly
                    style={{
                      backgroundColor: '#f5f5f5',
                      cursor: 'default',
                      color: '#333',
                      border: '1px solid #e0e0e0',
                      textTransform: 'capitalize'
                    }}
                  />
                </div>

                {selectedUsuario.rol_data?.empresa_nombre && (
                  <div className={styles.formGroup}>
                    <label>Empresa Asociada</label>
                    <input
                      type="text"
                      value={selectedUsuario.rol_data.empresa_nombre}
                      disabled
                      readOnly
                      style={{
                        backgroundColor: '#f5f5f5',
                        cursor: 'default',
                        color: '#333',
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  </div>
                )}

                {selectedUsuario.rol_data?.especialidad && (
                  <div className={styles.formGroup}>
                    <label>Especialidad</label>
                    <input
                      type="text"
                      value={selectedUsuario.rol_data.especialidad}
                      disabled
                      readOnly
                      style={{
                        backgroundColor: '#f5f5f5',
                        cursor: 'default',
                        color: '#333',
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Metadatos */}
              {(selectedUsuario.fecha_creacion || selectedUsuario.fecha_actualizacion) && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Información Adicional
                  </h4>

                  <div className={styles.formRow}>
                    {selectedUsuario.fecha_creacion && (
                      <div className={styles.formGroup}>
                        <label>Fecha de Creación</label>
                        <input
                          type="text"
                          value={new Date(selectedUsuario.fecha_creacion).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          disabled
                          readOnly
                          style={{
                            backgroundColor: '#f5f5f5',
                            cursor: 'default',
                            color: '#333',
                            border: '1px solid #e0e0e0',
                            fontSize: '13px'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className={styles.formActions}>
                {/* Botón de Activar/Desactivar */}
                <button
                  onClick={() => handleToggleStatus(selectedUsuario.id, selectedUsuario.nombre, selectedUsuario.activo)}
                  disabled={loadingAction}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: selectedUsuario.activo === 1 || selectedUsuario.activo === true ? '#f44336' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loadingAction ? 'not-allowed' : 'pointer',
                    opacity: loadingAction ? 0.6 : 1,
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    if (!loadingAction) {
                      e.currentTarget.style.opacity = '0.9';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loadingAction) {
                      e.currentTarget.style.opacity = '1';
                    }
                  }}
                >
                  {selectedUsuario.activo === 1 || selectedUsuario.activo === true ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 2V1h4v1h4v2h-1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V4H2V2h4zm1 3v7h2V5H7zm-2 0v7h2V5H5zm6 0v7h-2V5h2z" />
                      </svg>
                      {loadingAction ? 'Desactivando...' : 'Desactivar Usuario'}
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.5 2L6 9.5 2.5 6 1 7.5l5 5 9-9z" />
                      </svg>
                      {loadingAction ? 'Activando...' : 'Activar Usuario'}
                    </>
                  )}
                </button>

                {/* Botón de Cerrar */}
                <button
                  onClick={() => setShowViewModal(false)}
                  disabled={loadingAction}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loadingAction ? 'not-allowed' : 'pointer',
                    opacity: loadingAction ? 0.6 : 1,
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => {
                    if (!loadingAction) {
                      e.currentTarget.style.backgroundColor = '#1976d2';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loadingAction) {
                      e.currentTarget.style.backgroundColor = '#2196f3';
                    }
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal EDITAR USUARIO */}
      {showEditModal && selectedUsuario && (
        <div className={styles.modalOverlay} onClick={() => {
          setShowEditModal(false);
          resetForm();
          setSelectedUsuario(null);
        }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.userIcon} style={{ backgroundColor: '#ff9800' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className={styles.modalTitle}>Editar Usuario</h3>
              <button className={styles.closeBtn} onClick={() => {
                setShowEditModal(false);
                resetForm();
                setSelectedUsuario(null);
              }}>×</button>
            </div>

            <form onSubmit={handleUpdateUser} className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombres completos"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Apellidos *</label>
                  <input
                    type="text"
                    name="apellidos"
                    placeholder="Apellidos completos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Número de Documento</label>
                <input
                  type="text"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  disabled
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                />
                <small className={styles.helperText}>El documento no puede ser modificado</small>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Correo Electrónico *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Rol Asignado</label>
                <input
                  type="text"
                  value={formData.rol}
                  disabled
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed', textTransform: 'capitalize' }}
                />
                <small className={styles.helperText}>El rol no puede ser modificado después de la creación</small>
              </div>

              {formData.empresa && (
                <div className={styles.formGroup}>
                  <label>Empresa</label>
                  <select
                    name="empresa"
                    value={formData.empresa}
                    disabled
                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  >
                    <option value={formData.empresa}>
                      {selectedUsuario.rol_data?.empresa_nombre || 'Empresa actual'}
                    </option>
                  </select>
                  <small className={styles.helperText}>La empresa no puede ser modificada desde aquí</small>
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                    setSelectedUsuario(null);
                  }}
                  disabled={loadingAction}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={loadingAction}
                  style={{ backgroundColor: '#ff9800' }}
                >
                  {loadingAction ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de CREAR Usuario */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.userIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className={styles.modalTitle}>Crear Nuevo Usuario</h3>
              <button className={styles.closeBtn} onClick={() => setShowCreateModal(false)}>×</button>
            </div>

            <form onSubmit={handleCreateUser} className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombres completos"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Apellidos *</label>
                  <input
                    type="text"
                    name="apellidos"
                    placeholder="Apellidos completos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Número de Documento *</label>
                <input
                  type="text"
                  name="numeroDocumento"
                  placeholder="Número de identificación"
                  value={formData.numeroDocumento}
                  onChange={handleInputChange}
                  required
                />
                <small className={styles.helperText}>
                  Este documento debe ser único en el sistema
                </small>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Correo Electrónico *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="usuario@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Rol Asignado *</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar rol...</option>
                  {rolesDelSistema.map(rol => (
                    <option key={rol.id} value={rol.tipo}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {formData.rol === 'ponente' && (
                <div className={styles.formGroup}>
                  <label>Especialidad</label>
                  <input
                    type="text"
                    name="especialidad"
                    placeholder="Ej: Tecnología, Negocios..."
                    value={formData.especialidad}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {(formData.rol === 'gerente' || formData.rol === 'organizador') && (
                <div className={styles.formGroup}>
                  <label>Empresa *</label>
                  <select
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    disabled={loadingEmpresas}
                    required
                  >
                    <option value="">Seleccione una empresa...</option>
                    {loadingEmpresas ? (
                      <option disabled>Cargando empresas...</option>
                    ) : (
                      empresas.map(empresa => (
                        <option key={empresa.id} value={empresa.id}>
                          {empresa.nombre}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}

              {formData.rol && formData.rol !== 'gerente' && formData.rol !== 'organizador' && formData.rol !== 'ponente' && (
                <div className={styles.formGroup}>
                  <label>Empresa (Opcional)</label>
                  <select
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    disabled={loadingEmpresas}
                  >
                    <option value="">Sin empresa asignada</option>
                    {empresas.map(empresa => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnSubmit}>
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Creación */}
      {showPasswordModal && credencialesUsuario && (
        <div className={styles.modalOverlay} onClick={() => setShowPasswordModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className={styles.modalHeader}>
              <div className={styles.userIcon} style={{ backgroundColor: '#4caf50' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className={styles.modalTitle}>Usuario Creado Exitosamente</h3>
              <button className={styles.closeBtn} onClick={() => setShowPasswordModal(false)}>×</button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{
                backgroundColor: '#e8f5e9',
                border: '1px solid #4caf50',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <p style={{
                  color: '#2e7d32',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {credencialesUsuario.mensaje}
                </p>
              </div>

              <div style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '12px',
                  marginTop: 0
                }}>
                  Información del Usuario:
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666', fontSize: '14px' }}>Nombre:</span>
                    <span style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>{credencialesUsuario.nombre}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666', fontSize: '14px' }}>Correo:</span>
                    <span style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>{credencialesUsuario.correo}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666', fontSize: '14px' }}>Rol:</span>
                    <span style={{
                      color: '#333',
                      fontSize: '14px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {credencialesUsuario.rol}
                    </span>
                  </div>
                  {credencialesUsuario.empresa !== 'N/A' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666', fontSize: '14px' }}>Empresa:</span>
                      <span style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>{credencialesUsuario.empresa}</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{
                backgroundColor: '#fff3e0',
                border: '1px solid #ff9800',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="#f57c00" />
                  </svg>
                  <div>
                    <p style={{
                      color: '#e65100',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      margin: '0 0 8px 0',
                      fontWeight: '600'
                    }}>
                      Contraseña Temporal Generada
                    </p>
                    <p style={{
                      color: '#f57c00',
                      fontSize: '12px',
                      lineHeight: '1.5',
                      margin: 0
                    }}>
                      Se ha generado una contraseña temporal y se ha enviado al correo electrónico del usuario.
                      El usuario deberá cambiar esta contraseña en su primer inicio de sesión.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setCredencialesUsuario(null);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#4caf50'}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;