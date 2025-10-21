import { useNavigate } from 'react-router-dom';
import { isAdmin, isAsistente, getRoleName } from '../../utils/roleUtils';
import headerStyles from './header.module.css';
import notificationsIcon from '../../assets/notifications.png';
import logoIcon from '../../assets/evento-remove.png';

const Header = () => {
	const navigate = useNavigate();
	
	let user = null;
	const raw = localStorage.getItem('user');
	if (raw) user = JSON.parse(raw);

	const email = (user?.email || user?.correo || user?.username || '')?.toString();

	// Determinar rol
	let displayRole = 'Invitado';
	if (isAdmin(user)) displayRole = 'Administrador';
	else if (isAsistente(user)) displayRole = 'Asistente';
	else if (user) displayRole = getRoleName(user) || 'Usuario';

	// Construir avatar 
	const nameSource = (email).toString();
	const initials = nameSource
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 3)
		.map(s => s[0].toUpperCase())
		.join('') || 'U';

	// Manejar clic en el logo
	const handleLogoClick = () => {
		// Limpiar localStorage (cerrar sesión)
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		// Redirigir al login
		navigate('/login');
	};

	return (
		<header className={headerStyles.header}>
			<div className={headerStyles.left}>
				<button 
					className={headerStyles.logoBox}
					onClick={handleLogoClick}
					type="button"
				>
					<img className={headerStyles.logoImg} src={logoIcon} alt="Evento" />
				</button>
			</div>

			<div className={headerStyles.right}>
				<img className={headerStyles.logoBox} src={notificationsIcon} alt="Notificaciones" />

				<div className={headerStyles.userInfo}>
					<div className={headerStyles.role}>{displayRole}</div>
					<div className={headerStyles.email}>{email || '—'}</div>
				</div>

				<div className={headerStyles.avatar} title={email || 'Usuario'}>{initials}</div>
			</div>
		</header>
	);
};

export default Header;