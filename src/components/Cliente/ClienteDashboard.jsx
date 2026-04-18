import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const DELIVERY_LABEL = {
  en_preparacion: 'En preparación',
  en_reparto: 'En reparto',
  entregado: 'Entregado',
}

const DELIVERY_BADGE = {
  en_preparacion: 'badge badge-blue',
  en_reparto: 'badge badge-yellow',
  entregado: 'badge badge-green',
}

export default function ClienteDashboard() {
  const { currentUser, pedidos, users } = useApp()
  const misPedidos = pedidos.filter(p => p.clienteId === currentUser.id)
  const saldo = users.find(u => u.id === currentUser.id)?.saldo ?? 0

  const solicitados = misPedidos.filter(p => p.estado === 'solicitado').length
  const aprobados = misPedidos.filter(p => p.estado === 'aprobado').length
  const cancelados = misPedidos.filter(p => p.estado === 'cancelado').length
  const total = misPedidos.reduce((s, p) => p.estado === 'aprobado' ? s + p.total : s, 0)

  const enCurso = misPedidos.filter(
    p => p.estado === 'aprobado' && p.estadoEntrega !== 'entregado'
  )

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Bienvenido, {currentUser.nombre}</h2>
        <p className="page-subtitle">Resumen de tu actividad</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>🕐</div>
          <span className="stat-label">Pendientes</span>
          <span className="stat-value">{solicitados}</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>✓</div>
          <span className="stat-label">Aprobados</span>
          <span className="stat-value">{aprobados}</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2' }}>✕</div>
          <span className="stat-label">Cancelados</span>
          <span className="stat-value">{cancelados}</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>$</div>
          <span className="stat-label">Saldo pendiente</span>
          <span className="stat-value" style={{ fontSize: 20 }}>
            ${saldo.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {/* Pedidos en curso */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Pedidos en curso</span>
            <Link to="/cliente/mis-pedidos" className="btn btn-ghost btn-sm">Ver todos</Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {enCurso.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <p className="empty-state-text">Sin pedidos en curso</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Total</th>
                      <th>Estado envío</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enCurso.slice(0, 5).map(p => (
                      <tr key={p.id}>
                        <td><strong>#{p.id}</strong></td>
                        <td>${p.total.toLocaleString('es-AR')}</td>
                        <td>
                          <span className={DELIVERY_BADGE[p.estadoEntrega]}>
                            {DELIVERY_LABEL[p.estadoEntrega]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Accesos rápidos</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link to="/cliente/nuevo-pedido" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              + Crear nuevo pedido
            </Link>
            <Link to="/cliente/mis-pedidos" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
              Ver mis pedidos
            </Link>
            <Link to="/cliente/estado-cuenta" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
              Ver estado de cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
