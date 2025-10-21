import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './empresa.module.css';
import Header from '../../layouts/Header/header';

const Empresa = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    nit: '',
    direccion: '',
    id_pais: '',
    id_ciudad: '',
    telefono: '',
    correo: ''
  });

  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar países al montar el componente
  useEffect(() => {
    fetchPaises();
  }, []);

  // Cargar ciudades cuando cambia el país
  useEffect(() => {
    if (formData.id_pais) {
      fetchCiudades(formData.id_pais);
    } else {
      setCiudades([]);
      setFormData(prev => ({ ...prev, id_ciudad: '' }));
    }
  }, [formData.id_pais]);

  const fetchPaises = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/paises/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        // Los datos vienen en result.data según tu ApiResponse
        if (result.success && result.data) {
          setPaises(result.data);
        } else {
          setPaises([]);
        }
      }
    } catch (err) {
      console.error('Error al cargar países:', err);
      setPaises([]);
    }
  };

  const fetchCiudades = async (idPais) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/ciudades/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        // Los datos vienen en result.data según tu ApiResponse
        if (result.success && result.data) {
          setCiudades(result.data);
        } else {
          setCiudades([]);
        }
      }
    } catch (err) {
      console.error('Error al cargar ciudades:', err);
      setCiudades([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/api/empresas/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Empresa creada exitosamente');
        navigate('/asistente');
      } else {
        setError(result.message || 'Error al crear la empresa');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/asistente');
  };

  return (
    <div className={styles.empresaContainer}>
      <Header />
      <div className={styles.empresaCard}>
        <h2 className={styles.empresaTitle}>Solicitud de Afiliación de Empresa</h2>

        <form onSubmit={handleSubmit}>
          {/* Información Básica de la Empresa */}
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>📋</span>
            <span>Información Básica de la Empresa</span>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="nombre">
                Nombre de la Empresa<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ingrese el nombre de la empresa"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="nit">
                NIT<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="nit"
                name="nit"
                value={formData.nit}
                onChange={handleChange}
                required
                placeholder="Ingrese el NIT"
              />
            </div>
          </div>

          {/* Información de Contacto */}
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>📍</span>
            <span>Información de Contacto</span>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="direccion">
              Dirección<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              placeholder="Ingrese la dirección"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="id_pais">
                País<span className={styles.required}>*</span>
              </label>
              <select
                id="id_pais"
                name="id_pais"
                value={formData.id_pais}
                onChange={handleChange}
                required
                className={styles.selectInput}
              >
                <option value="">Seleccione un país</option>
                {paises.map(pais => (
                  <option key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="id_ciudad">
                Ciudad<span className={styles.required}>*</span>
              </label>
              <select
                id="id_ciudad"
                name="id_ciudad"
                value={formData.id_ciudad}
                onChange={handleChange}
                required
                disabled={!formData.id_pais}
                className={styles.selectInput}
              >
                <option value="">Seleccione una ciudad</option>
                {ciudades.map(ciudad => (
                  <option key={ciudad.id} value={ciudad.id}>
                    {ciudad.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="telefono">
                Teléfono<span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                placeholder="Ingrese el teléfono"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="correo">
                Correo Electrónico<span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                placeholder="Ingrese el correo electrónico"
              />
            </div>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          {/* Botones */}
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.btnCancel}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.btnSubmit}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Empresa;