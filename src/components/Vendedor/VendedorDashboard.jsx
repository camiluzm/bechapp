import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const DELIVERY_LABEL = {
  en_preparacion: 'En preparación',
  en_reparto: 'En reparto',
  entregado: 'Entregado',
}

export default function VendedorDashboard() {
  const { pedidos, users, getClienteById } = useApp()

  const solicitados = pedidos.filter(p => p.estado === 'solicitado')
  const aprobados = pedidos.filter(p => p.estado === 'aprobado')
  const cancelados = pedidos.filter(p => p.estado === 'cancelado')
  const entregados = pedidos.filter(p => p.estadoEntrega === 'entregado')
  const clientes = users.filter(u => u.role === 'cliente')

  const totalFacturado = aprobados.reduce((s, p) => s + p.total, 0)

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <p className="page-subtitle">Resumen general del sistema</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '3px solid #d97706' }}>
          <span className="stat-label">Pendientes</span>
          <span className="stat-value">{solicitados.length}</span>
          <Link to="/vendedor/pedidos-solicitados" className="text-sm" style={{ color: '#1e40af' }}>
            Ver solicitudes →
          </Link>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid #059669' }}>
          <span className="stat-label">Aprobados</span>
          <span className="stat-value">{aprobados.length}</span>
          <Link to="/vendedor/pedidos-aprobados" className="text-sm" style={{ color: '#1e40af' }}>
            Ver aprobados →
          </Link>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid #dc2626' }}>
          <span className="stat-label">Cancelados</span>
          <span className="stat-value">{cancelados.length}</span>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid #1e40af' }}>
          <span className="stat-label">Entregados</span>
          <span className="stat-value">{entregados.length}</span>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid #7c3aed' }}>
          <span className="stat-label">Total facturado</span>
          <span className="stat-value" style={{ fontSize: 18 }}>
            ${totalFacturado.toLocaleString('es-AR')}
          </span>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid #0891b2' }}>
          <span className="stat-label">Clientes activos</span>
          <span className="stat-value">{clientes.length}</span>
          <Link to="/vendedor/clientes" className="text-sm" style={{ color: '#1e40af' }}>
            Ver clientes →
          </Link>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {/* Últimas solicitudes */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Últimas solicitudes</span>
            <Link to="/vendedor/pedidos-solicitados" className="btn btn-ghost btn-sm">Ver todas</Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {solicitados.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <p className="empty-state-text">Sin solicitudes pendientes</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitados.slice(0, 5).map(p => {
                      const cliente = getClienteById(p.clienteId)
                      return (
                        <tr key={p.id}>
                          <td><strong>#{p.id}</strong></td>
                          <td>{cliente?.nombre}</td>
                          <td>${p.total.toLocaleString('es-AR')}</td>
                          <td>{p.fechaCreacion}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Pedidos en preparación / reparto */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">En preparación / reparto</span>
            <Link to="/vendedor/pedidos-aprobados" className="btn btn-ghost btn-sm">Ver todos</Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {aprobados.filter(p => p.estadoEntrega !== 'entregado').length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🚚</div>
                <p className="empty-state-text">Sin pedidos en proceso</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Cliente</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aprobados
                      .filter(p => p.estadoEntrega !== 'entregado')
                      .slice(0, 5)
                      .map(p => {
                        const cliente = getClienteById(p.clienteId)
                        return (
                          <tr key={p.id}>
                            <td><strong>#{p.id}</strong></td>
                            <td>{cliente?.nombre}</td>
                            <td>
                              <span className={
                                p.estadoEntrega === 'en_reparto' ? 'badge badge-yellow' : 'badge badge-blue'
                              }>
                                {DELIVERY_LABEL[p.estadoEntrega]}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
