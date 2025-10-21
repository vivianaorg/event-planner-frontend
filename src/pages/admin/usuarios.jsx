import useUsuarios from '../../components/UsuarioRoute';
import styles from './usuarios.module.css';
import { useState } from 'react';

const Usuarios = () => {
  const { 
    usuarios, 
    loading, 
    error, 
    searchTerm,
    handleSearch,
    deleteUsuario,
    fetchUsuarios
  } = useUsuarios();

  const [filterBy, setFilterBy] = useState('todas');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    tipoDocumento: '',
    numeroDocumento: '',
    telefono: '',
    email: '',
    rol: '',
    empresa: ''
  });

  const rolesDelSistema = [
    { id: 2, nombre: 'Gerente', tipo: 'gerente' },
    { id: 3, nombre: 'Organizador', tipo: 'organizador' },
    { id: 4, nombre: 'Ponente', tipo: 'ponente' },
    { id: 5, nombre: 'Asistente', tipo: 'asistente' }
  ];

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
      tipoDocumento: '',
      numeroDocumento: '',
      telefono: '',
      email: '',
      rol: '',
      empresa: ''
    });
  };

  // Crear usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: `${formData.nombre} ${formData.apellidos}`,
          cedula: formData.numeroDocumento,
          email: formData.email,
          telefono: formData.telefono,
          rol: formData.rol,
          empresa: formData.empresa || 'N/A'
        })
      });

      if (response.ok) {
        alert('Usuario creado exitosamente');
        setShowCreateModal(false);
        resetForm();
        fetchUsuarios(); // Recargar la lista
      } else {
        alert('Error al crear usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear usuario');
    }
  };

  // Manejar eliminación de usuario
  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario ${nombre}?`)) {
      const result = await deleteUsuario(id);
      if (result.success) {
        alert('Usuario eliminado exitosamente');
      } else {
        alert(result.error || 'Error al eliminar usuario');
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
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
                  <tr key={usuario.id || usuario._id}>
                    <td>{usuario.nombre || 'N/A'}</td>
                    <td>{usuario.cedula || 'V-'}</td>
                    <td>{usuario.email || usuario.correo || 'N/A'}</td>
                    <td>{usuario.telefono || 'N/A'}</td>
                    <td>{usuario.empresa || 'N/A'}</td>
                    <td>
                      <div className={styles.rolCell}>
                        <span className={styles.rolBadge}>
                          {usuario.rol ? usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1) : 'N/A'}
                        </span>
                        <div className={styles.actionIcons}>
                          <button 
                            className={styles.iconBtn}
                            title="Ver"
                            onClick={() => console.log('Ver', usuario)}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M8 3C4.5 3 1.7 5.6 1 8c.7 2.4 3.5 5 7 5s6.3-2.6 7-5c-.7-2.4-3.5-5-7-5zm0 8a3 3 0 110-6 3 3 0 010 6z"/>
                            </svg>
                          </button>
                          <button 
                            className={styles.iconBtn}
                            title="Editar"
                            onClick={() => console.log('Editar', usuario)}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M11.5 1.5l3 3-9 9H2.5v-3l9-9zm1.4-.4a1 1 0 011.4 0l1.6 1.6a1 1 0 010 1.4l-1.1 1-3-3 1.1-1z"/>
                            </svg>
                          </button>
                          <button 
                            className={`${styles.iconBtn} ${styles.delete}`}
                            title="Eliminar"
                            onClick={() => handleDelete(usuario.id || usuario._id, usuario.nombre)}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M6 2V1h4v1h4v2h-1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V4H2V2h4zm1 3v7h2V5H7zm-2 0v7h2V5H5zm6 0v7h-2V5h2z"/>
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

      {/* Modal de Crear Usuario */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.userIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.modalTitle}>Información Personal</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
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

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Tipo de Documento *</label>
                  <select
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="V">V - Venezolano</option>
                    <option value="E">E - Extranjero</option>
                    <option value="P">P - Pasaporte</option>
                  </select>
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
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="3001234567"
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
                    placeholder="gerente@dge-4du.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <small className={styles.helperText}>
                    Se enviará una notificación a este correo
                  </small>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Rol Asignado</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Gerente</option>
                  {rolesDelSistema.map(rol => (
                    <option key={rol.id} value={rol.tipo}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
                <small className={styles.helperText}>
                  Este rol cuanta con permisos completos de gestión operativa
                </small>
              </div>

              <div className={styles.formGroup}>
                <label>Empresa (Si aplica)</label>
                <select
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Empresa A">Empresa A</option>
                  <option value="Empresa B">Empresa B</option>
                  <option value="Empresa C">Empresa C</option>
                </select>
              </div>

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
                <button
                  type="submit"
                  className={styles.btnSubmit}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;