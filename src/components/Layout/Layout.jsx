import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const clienteLinks = [
  { to: '/cliente', label: 'Dashboard', icon: '◉', end: true },
  { to: '/cliente/nuevo-pedido', label: 'Nuevo Pedido', icon: '+' },
  { to: '/cliente/mis-pedidos', label: 'Mis Pedidos', icon: '▤' },
  { to: '/cliente/estado-cuenta', label: 'Estado de Cuenta', icon: '$' },
  { to: '/cliente/bugs', label: 'Bugs y Mejoras', icon: '⚑' },
]

const vendedorLinks = [
  { to: '/vendedor', label: 'Dashboard', icon: '◉', end: true },
  { to: '/vendedor/pedidos-solicitados', label: 'Pedidos Solicitados', icon: '○' },
  { to: '/vendedor/pedidos-aprobados', label: 'Pedidos Aprobados', icon: '✓' },
  { to: '/vendedor/pedidos-cancelados', label: 'Pedidos Cancelados', icon: '✕' },
  { to: '/vendedor/clientes', label: 'Clientes', icon: '◈' },
  { to: '/vendedor/bugs', label: 'Bugs y Mejoras', icon: '⚑' },
]

export default function Layout() {
  const { currentUser, logout, pedidos } = useApp()
  const navigate = useNavigate()
  const links = currentUser?.role === 'vendedor' ? vendedorLinks : clienteLinks

  const pendingCount = pedidos.filter(p => p.estado === 'solicitado').length

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>Bech<span style={{ color: '#3b82f6' }}>app</span></h1>
          <div className="sidebar-role">
            {currentUser?.role === 'vendedor' ? 'Panel Vendedor' : 'Portal Cliente'}
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
              {link.to === '/vendedor/pedidos-solicitados' && pendingCount > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 7px',
                  minWidth: '20px',
                  textAlign: 'center',
                }}>
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <div className="avatar">
              {currentUser?.nombre?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="sidebar-user-name">{currentUser?.nombre}</div>
              <div className="sidebar-user-role">
                {currentUser?.role === 'vendedor' ? 'Vendedor' : 'Cliente'}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
