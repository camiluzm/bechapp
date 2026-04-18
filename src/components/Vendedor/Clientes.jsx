import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const DELIVERY_LABEL = {
  en_preparacion: 'En preparación',
  en_reparto: 'En reparto',
  entregado: 'Entregado',
}

function ModalCliente({ cliente, pedidos, onClose }) {
  const misPedidos = pedidos.filter(p => p.clienteId === cliente.id)
  const aprobados = misPedidos.filter(p => p.estado === 'aprobado')
  const totalComprado = aprobados.reduce((s, p) => s + p.total, 0)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Historial de {cliente.nombre}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Resumen */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{misPedidos.length}</div>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Total pedidos</div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1e40af' }}>${totalComprado.toLocaleString('es-AR')}</div>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Total comprado</div>
            </div>
            <div style={{ background: '#fee2e2', borderRadius: 8, padding: '12px 16px', textAlign: 'center', border: '1px solid #fecaca' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#dc2626' }}>${cliente.saldo.toLocaleString('es-AR')}</div>
              <div style={{ fontSize: 11, color: '#dc2626', textTransform: 'uppercase' }}>Saldo pendiente</div>
            </div>
          </div>

          {/* Historial */}
          {misPedidos.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">Sin pedidos todavía</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Entrega</th>
                  </tr>
                </thead>
                <tbody>
                  {misPedidos.map(p => (
                    <tr key={p.id}>
                      <td><strong>#{p.id}</strong></td>
                      <td>{p.fechaCreacion}</td>
                      <td><strong>${p.total.toLocaleString('es-AR')}</strong></td>
                      <td>
                        <span className={
                          p.estado === 'aprobado' ? 'badge badge-green' :
                          p.estado === 'cancelado' ? 'badge badge-red' :
                          'badge badge-yellow'
                        }>
                          {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                        </span>
                      </td>
                      <td>
                        {p.estadoEntrega ? (
                          <span style={{ fontSize: 12, color: '#64748b' }}>
                            {DELIVERY_LABEL[p.estadoEntrega]}
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}

export default function Clientes() {
  const { users, pedidos } = useApp()
  const [clienteModal, setClienteModal] = useState(null)

  const clientes = users.filter(u => u.role === 'cliente')

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Clientes</h2>
        <p className="page-subtitle">{clientes.length} clientes registrados</p>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {clientes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <p className="empty-state-text">Sin clientes registrados</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Email</th>
                    <th>Total pedidos</th>
                    <th>Aprobados</th>
                    <th>Saldo pendiente</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(c => {
                    const misPedidos = pedidos.filter(p => p.clienteId === c.id)
                    const aprobados = misPedidos.filter(p => p.estado === 'aprobado').length
                    return (
                      <tr key={c.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="avatar" style={{ width: 30, height: 30, fontSize: 12 }}>
                              {c.nombre[0].toUpperCase()}
                            </div>
                            <strong>{c.nombre}</strong>
                          </div>
                        </td>
                        <td style={{ color: '#64748b' }}>{c.email}</td>
                        <td style={{ textAlign: 'center' }}>{misPedidos.length}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="badge badge-green">{aprobados}</span>
                        </td>
                        <td>
                          <span style={{
                            fontWeight: 700,
                            color: c.saldo > 0 ? '#dc2626' : '#059669'
                          }}>
                            ${c.saldo.toLocaleString('es-AR')}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setClienteModal(c)}
                          >
                            Ver historial
                          </button>
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

      {clienteModal && (
        <ModalCliente
          cliente={clienteModal}
          pedidos={pedidos}
          onClose={() => setClienteModal(null)}
        />
      )}
    </div>
  )
}
