import { useApp } from '../../context/AppContext'

export default function EstadoCuenta() {
  const { currentUser, pedidos, users } = useApp()
  const saldo = users.find(u => u.id === currentUser.id)?.saldo ?? 0

  const misPedidos = pedidos.filter(p => p.clienteId === currentUser.id)
  const aprobados = misPedidos.filter(p => p.estado === 'aprobado')
  const entregados = aprobados.filter(p => p.estadoEntrega === 'entregado')
  const enCurso = aprobados.filter(p => p.estadoEntrega !== 'entregado')

  const totalComprado = aprobados.reduce((s, p) => s + p.total, 0)
  const totalEntregado = entregados.reduce((s, p) => s + p.total, 0)
  const totalEnCurso = enCurso.reduce((s, p) => s + p.total, 0)

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Estado de Cuenta</h2>
        <p className="page-subtitle">Resumen financiero de tus compras</p>
      </div>

      {/* Resumen financiero */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ borderTop: '3px solid #dc2626' }}>
          <span className="stat-label">Saldo pendiente</span>
          <span className="stat-value" style={{ color: '#dc2626', fontSize: 22 }}>
            ${saldo.toLocaleString('es-AR')}
          </span>
          <span className="text-sm text-muted">Total adeudado</span>
        </div>
        <div className="stat-card" style={{ borderTop: '3px solid #1e40af' }}>
          <span className="stat-label">Total comprado</span>
          <span className="stat-value" style={{ fontSize: 22 }}>
            ${totalComprado.toLocaleString('es-AR')}
          </span>
          <span className="text-sm text-muted">Pedidos aprobados</span>
        </div>
        <div className="stat-card" style={{ borderTop: '3px solid #059669' }}>
          <span className="stat-label">Total entregado</span>
          <span className="stat-value" style={{ fontSize: 22, color: '#059669' }}>
            ${totalEntregado.toLocaleString('es-AR')}
          </span>
          <span className="text-sm text-muted">{entregados.length} pedidos</span>
        </div>
        <div className="stat-card" style={{ borderTop: '3px solid #d97706' }}>
          <span className="stat-label">En curso</span>
          <span className="stat-value" style={{ fontSize: 22, color: '#d97706' }}>
            ${totalEnCurso.toLocaleString('es-AR')}
          </span>
          <span className="text-sm text-muted">{enCurso.length} pedidos activos</span>
        </div>
      </div>

      {/* Detalle de pedidos aprobados */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Historial de pedidos aprobados</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {aprobados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📄</div>
              <p className="empty-state-text">Sin pedidos aprobados todavía</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Estado entrega</th>
                  </tr>
                </thead>
                <tbody>
                  {aprobados.map(p => (
                    <tr key={p.id}>
                      <td><strong>#{p.id}</strong></td>
                      <td>{p.fechaCreacion}</td>
                      <td style={{ color: '#64748b', fontSize: 12, maxWidth: 200 }}>
                        {p.items.map(i => `${i.nombre} ×${i.cantidad}`).join(', ')}
                      </td>
                      <td>
                        <strong style={{ color: '#1e40af' }}>
                          ${p.total.toLocaleString('es-AR')}
                        </strong>
                      </td>
                      <td>
                        {p.estadoEntrega === 'entregado' ? (
                          <span className="badge badge-green">Entregado ✓</span>
                        ) : p.estadoEntrega === 'en_reparto' ? (
                          <span className="badge badge-yellow">En reparto</span>
                        ) : (
                          <span className="badge badge-blue">En preparación</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {saldo > 0 && (
        <div className="alert alert-warning" style={{ marginTop: 20 }}>
          <strong>Saldo a pagar:</strong> Tenés un saldo pendiente de{' '}
          <strong>${saldo.toLocaleString('es-AR')}</strong>. Comunicáte con el vendedor para coordinar el pago.
        </div>
      )}
    </div>
  )
}
