import { Eye, EyeOff, Calendar, User, Briefcase, Shield, Mic, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import '../pages/Login.css';
import { useLogin } from '../components/login'; // Importar el hook

export default function Login() {
  // Usar el hook useLogin para la lógica de autenticación
  const {
    email,
    password,
    showPassword,
    error,
    loading,
    setEmail,
    setPassword,
    handleLogin,
    togglePasswordVisibility,
    handleNavigateToForgotPassword,
    handleNavigateToRegister
  } = useLogin();

  // Leer el rol preseleccionado del localStorage
  const [selectedRole, setSelectedRole] = useState(() => {
    const savedRole = localStorage.getItem('selected_role');
    return savedRole || 'asistente';
  });
  
  const [rememberMe, setRememberMe] = useState(false);

  // Limpiar el rol guardado del localStorage al desmontar el componente
  useEffect(() => {
    return () => {
      localStorage.removeItem('selected_role');
    };
  }, []);

  const roles = [
    { id: 'asistente', name: 'Asistente', subtitle: 'Participante', icon: User },
    { id: 'gerente', name: 'Gerente', subtitle: 'Organizador', icon: Briefcase },
    { id: 'administrador', name: 'Administrador', subtitle: 'Sistema', icon: Shield },
    { id: 'ponente', name: 'Ponente', subtitle: 'Expositor', icon: Mic }
  ];

  // Handler mejorado que incluye el rol
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Guardar el rol seleccionado antes de hacer login
    localStorage.setItem('selected_role', selectedRole);
    
    // Validación básica
    if (!email.trim() || !password) {
      // El error se manejará en el hook useLogin
      return;
    }

    // Llamar al handleLogin del hook
    await handleLogin(e);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="logo-box">
            <div className="logo-icon">
              <Calendar size={28} color="#fff" />
            </div>
            <h1 className="logo-text">EVENT PLANNER</h1>
          </div>
          <p className="subtitle">Selecciona tu tipo de cuenta para continuar</p>
        </div>

        {/* Roles */}
        <div className="role-grid">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <div
                key={role.id}
                className={`role-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedRole(role.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(ev) => { 
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    setSelectedRole(role.id);
                  }
                }}
              >
                <div className={`role-icon ${isSelected ? 'selected' : ''}`}>
                  <Icon size={22} color="#fff" />
                </div>
                <h3 className="role-name">{role.name}</h3>
                <p className="role-subtitle">{role.subtitle}</p>
                {isSelected && <span className="checkmark">✓</span>}
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="error-box">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="form" onSubmit={handleSubmit}>
          <label>Correo Electrónico</label>
          <div className="input-group">
            <i className="icon">@</i>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <label>Contraseña</label>
          <div className="input-group">
            <i className="icon">🔒</i>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button 
              type="button" 
              className="toggle-pass" 
              onClick={togglePasswordVisibility}
              disabled={loading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="form-options">
            <label className="remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              Recordarme
            </label>
            <a 
              href="#" 
              className="forgot" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigateToForgotPassword();
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Registro */}
        <p className="register-text">
          ¿No tienes cuenta?{' '}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleNavigateToRegister();
            }}
          >
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}