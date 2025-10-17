import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-600">Ingresa a tu cuenta</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Email Input */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
            placeholder="tu@email.com"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end mb-6">
          <button 
            type="button"
            onClick={() => navigate('/forgotpassword')}
            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            ¿No tienes cuenta?
          </p>
          <button 
            onClick={() => window.location.href = '/register'}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}