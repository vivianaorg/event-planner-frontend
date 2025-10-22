import React, { useState, useEffect } from 'react';
import styles from './afiliaciones.module.css';

const AfiliacionesPendientes = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('No hay sesión activa');
        return;
      }

      const response = await fetch('http://localhost:3000/api/empresas/pendientes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        setError('Sesión expirada. Por favor inicia sesión nuevamente.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        return;
      }

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          // Filtrar solo empresas con estado 0 (pendientes)
          const empresasPendientes = result.data.filter(e => e.estado === 0);
          setEmpresas(empresasPendientes);
        } else {
          setEmpresas([]);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al cargar empresas');
      }
    } catch (error) {
      console.error('Error al cargar empresas:', error);
      setError('Error de conexión con el servidor');
      setEmpresas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, nombre) => {
    if (!window.confirm(`¿Aprobar la empresa "${nombre}"?`)) return;

    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://localhost:3000/api/empresas/${id}/aprobar`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ aprobar: true })
      });

      if (response.ok) {
        alert('✅ Empresa aprobada exitosamente');
        fetchEmpresas(); // Recargar lista
      } else {
        const result = await response.json();
        alert(result.message || 'Error al aprobar empresa');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al aprobar empresa');
    }
  };

  const handleReject = async (id, nombre) => {
    const motivo = prompt(`¿Por qué rechazas la empresa "${nombre}"?`);
    if (motivo === null) return;
    
    if (!motivo.trim()) {
      alert('Debes proporcionar un motivo para el rechazo');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://localhost:3000/api/empresas/${id}/aprobar`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          aprobar: false,
          motivo: motivo 
        })
      });

      if (response.ok) {
        alert('❌ Empresa rechazada');
        fetchEmpresas(); // Recargar lista
      } else {
        const result = await response.json();
        alert(result.message || 'Error al rechazar empresa');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al rechazar empresa');
    }
  };

  const filteredEmpresas = empresas.filter(empresa =>
    empresa.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.nit?.includes(searchTerm)
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Afiliaciones Pendientes</h1>
      </div>

      {/* Alert Banner */}
      {filteredEmpresas.length > 0 && (
        <div className={styles.alertBanner}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.alertIcon}>
            <circle cx="12" cy="12" r="10" stroke="#ff9800" strokeWidth="2" fill="none"/>
            <path d="M12 8v4M12 16h.01" stroke="#ff9800" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className={styles.alertText}>
            Solicitudes de Afiliación Pendientes ({filteredEmpresas.length})
          </span>
        </div>
      )}

      {/* Search */}
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar por nombre o NIT"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.searchIcon}>
            <circle cx="8" cy="8" r="6" stroke="#757575" strokeWidth="2"/>
            <path d="M13 13l5 5" stroke="#757575" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={fetchEmpresas} className={styles.btnRetry}>
            Reintentar
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className={styles.loading}>Cargando empresas...</div>
      ) : filteredEmpresas.length === 0 ? (
        <div className={styles.noResults}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{margin: '0 auto 16px'}}>
            <circle cx="32" cy="32" r="30" stroke="#ddd" strokeWidth="2" fill="none"/>
            <path d="M32 20v16M32 44h.01" stroke="#ddd" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p>{searchTerm ? 'No se encontraron empresas con ese criterio' : 'No hay solicitudes pendientes'}</p>
        </div>
      ) : (
        <div className={styles.empresasList}>
          {filteredEmpresas.map((empresa) => (
            <div key={empresa.id} className={styles.empresaCard}>
              <div className={styles.empresaInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Nombre Empresa</span>
                  <span className={styles.value}>{empresa.nombre}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>NIT</span>
                  <span className={styles.value}>{empresa.nit}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Dirección</span>
                  <span className={styles.value}>{empresa.direccion}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Teléfono</span>
                  <span className={styles.value}>{empresa.telefono}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>{empresa.correo || empresa.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Fecha Solicitud</span>
                  <span className={styles.value}>
                    {empresa.createdAt ? new Date(empresa.createdAt).toLocaleDateString('es-CO') : 'N/A'}
                  </span>
                </div>
              </div>

              <div className={styles.empresaActions}>
                <button
                  className={styles.btnAprobar}
                  onClick={() => handleApprove(empresa.id, empresa.nombre)}
                >
                  ✓ Aprobar
                </button>
                <button
                  className={styles.btnRechazar}
                  onClick={() => handleReject(empresa.id, empresa.nombre)}
                >
                  ✗ Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AfiliacionesPendientes;