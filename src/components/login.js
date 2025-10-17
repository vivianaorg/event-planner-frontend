import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000';

export const useLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setError('');
    setLoading(true);

    try {
      // Enviar con los nombres de campos que espera el backend
      const payload = { correo: email, contraseña: password };
      console.log('Enviando al backend:', payload);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Respuesta del backend:', data);

      if (!response.ok) {
        // Manejo de errores similar a tu plantilla
        let errorMessages = [];
        if (typeof data === 'object') {
          for (const messages of Object.values(data)) {
            if (Array.isArray(messages)) {
              errorMessages = errorMessages.concat(messages);
            } else if (typeof messages === 'string') {
              errorMessages.push(messages);
            }
          }
        } else if (typeof data === 'string') {
          errorMessages.push(data);
        }
        const errorMessage = errorMessages.join(', ') || 'Error durante el inicio de sesión';
        throw new Error(errorMessage);
      }

      // Los tokens están en data.data según la respuesta del backend
      const token = data.data?.accessToken;
      const refreshToken = data.data?.refreshToken;
      const usuario = data.data?.usuario;

      if (token) {
        localStorage.setItem('access_token', token);
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }
        // Guardar información del usuario
        if (usuario) {
          localStorage.setItem('user', JSON.stringify(usuario));
        }
        
        console.log('Login exitoso!');
        // Redirigir al dashboard usando React Router
        navigate('/dashboard');
      } else {
        throw new Error('No se recibió el token de acceso');
      }
      
    } catch (err) {
      console.error('Error durante el inicio de sesión:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNavigateToForgotPassword = () => {
    navigate('/forgotpassword');
  };

  const handleNavigateToRegister = () => {
    window.location.href = '/register';
  };

  return {
    // Estados
    email,
    password,
    showPassword,
    error,
    loading,
    
    // Funciones para actualizar estados
    setEmail,
    setPassword,
    
    // Funciones de acción
    handleLogin,
    togglePasswordVisibility,
    handleNavigateToForgotPassword,
    handleNavigateToRegister
  };
};