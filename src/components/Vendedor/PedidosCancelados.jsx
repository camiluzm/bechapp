import { useState } from 'react'
import { useApp } from '../../context/AppContext'

function ModalDetalle({ pedido, cliente, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Pedido #{pedido.id} — Cancelado</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="flex-between mb-4">
            <span className="text-muted text-sm">Cliente: <strong>{cliente?.nombre}</strong></span>
            <span className="text-muted text-sm">Fecha: {pedido.fechaCreacion}</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 0', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>Producto</th>
                <th style={{ textAlign: 'center', padding: '8px 0', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>Cant.</th>
                <th style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.items.map(item => (
                <tr key={item.productoId}>
                  <td style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', opacity: .6 }}>{item.nombre}</td>
                  <td style={{ padding: '10px 0', textAlign: 'center', borderBottom: '1px solid #f1f5f9', opacity: .6 }}>{item.cantidad}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', borderBottom: '1px solid #f1f5f9', opacity: .6 }}>
                    ${(item.cantidad * item.precioUnitario).toLocaleString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex-between" style={{ paddingTop: 12, borderTop: '2px solid #e2e8f0', marginBottom: 16 }}>
            <span style={{ fontWeight: 600 }}>Total (cancelado)</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#94a3b8', textDecoration: 'line-through' }}>
              ${pedido.total.toLocaleString('es-AR')}
            </span>
          </div>

          {pedido.notas && (
            <div className="alert alert-error">
              <strong>Motivo:</strong> {pedido.notas}
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

export default function PedidosCancelados() {
  const { pedidos, getClienteById } = useApp()
  const [modal, setModal] = useState(null)

  const cancelados = pedidos.filter(p => p.estado === 'cancelado')

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Pedidos Cancelados</h2>
        <p className="page-subtitle">{cancelados.length} pedidos cancelados</p>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {cancelados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <p className="empty-state-text">Sin pedidos cancelados</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Motivo</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cancelados.map(p => {
                    const cliente = getClienteById(p.clienteId)
                    return (
                      <tr key={p.id}>
                        <td><strong>#{p.id}</strong></td>
                        <td>{p.fechaCreacion}</td>
                        <td>{cliente?.nombre}</td>
                        <td style={{ color: '#94a3b8', fontSize: 12, maxWidth: 180, textDecoration: 'line-through' }}>
                          {p.items.map(i => `${i.nombre} ×${i.cantidad}`).join(', ')}
                        </td>
                        <td style={{ color: '#94a3b8', textDecoration: 'line-through' }}>
                          ${p.total.toLocaleString('es-AR')}
                        </td>
                        <td style={{ color: '#94a3b8', fontSize: 12, maxWidth: 160 }}>
                          {p.notas || '—'}
                        </td>
                        <td>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setModal(p)}
                          >
                            Ver
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

      {modal && (
        <ModalDetalle
          pedido={modal}
          cliente={getClienteById(modal.clienteId)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
