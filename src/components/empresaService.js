// src/services/empresaService.js

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Obtiene el token de autenticación del localStorage
 */
const getAuthToken = () => {
    try {
        // Token almacenado directamente
        const accessToken = localStorage.getItem('access_token');

        // También intentamos leer por compatibilidad
        const user = localStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;

        const token = accessToken || parsedUser?.token || parsedUser?.access_token;

        if (!token) {
            console.warn('⚠️ No se encontró ningún token en localStorage.');
            return null;
        }
        return token;
    } catch (error) {
        console.error('❌ Error al obtener token del localStorage:', error);
        return null;
    }
};

/**
 * Configuración de headers para las peticiones
 */
const getHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

/**
 * Maneja los errores de las respuestas HTTP
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error en la respuesta:', errorData);
        throw new Error(
            errorData.message ||
            errorData.error ||
            `Error ${response.status}: ${response.statusText}`
        );
    }
    return response.json();
};

/**
 * Servicio para gestionar empresas
 */
const empresaService = {
    /**
     * Obtiene la empresa asociada al gerente autenticado
     */
    obtenerEmpresaGerente: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/empresas`, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener empresa del gerente:', error);
            throw error;
        }
    },

    obtenerTodasCiudades: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/ciudades`, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener todas las ciudades:', error);
            throw error;
        }
    },

    /**
     * Obtiene una empresa por su ID
     */
    obtenerEmpresaPorId: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/empresas/${id}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener empresa por ID:', error);
            throw error;
        }
    },

    /**
     * Actualiza los datos de una empresa
     */
    actualizarEmpresa: async (id, datos) => {
        try {
            const response = await fetch(`${API_BASE_URL}/empresas/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(datos)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al actualizar empresa:', error);
            throw error;
        }
    },

    /**
     * 🔹 Obtiene una ciudad por su ID
     */
    obtenerCiudadPorId: async (idCiudad) => {
        try {
            const response = await fetch(`${API_BASE_URL}/ciudades/${idCiudad}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener ciudad por ID:', error);
            throw error;
        }
    },

    /**
     * 🔹 Obtiene un país por su ID
     */
    obtenerPaisPorId: async (idPais) => {
        try {
            const response = await fetch(`${API_BASE_URL}/paises/${idPais}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener país por ID:', error);
            throw error;
        }
    }

};

export default empresaService;
