import { useState } from 'react'
import { useApp } from '../../context/AppContext'

function ModalAprobar({ pedido, cliente, onAprobar, onCancelar, onClose }) {
  const { productos } = useApp()
  const [items, setItems] = useState(pedido.items.map(i => ({ ...i })))
  const [motivo, setMotivo] = useState('')
  const [cancelando, setCancelando] = useState(false)

  const total = items.reduce((s, i) => s + i.cantidad * i.precioUnitario, 0)

  const cambiarCantidad = (productoId, nuevaCantidad) => {
    const prod = productos.find(p => p.id === productoId)
    const val = Math.max(0, Math.min(Number(nuevaCantidad), prod?.stock ?? 999))
    if (val === 0) {
      setItems(prev => prev.filter(i => i.productoId !== productoId))
    } else {
      setItems(prev => prev.map(i => i.productoId === productoId ? { ...i, cantidad: val } : i))
    }
  }

  const handleAprobar = () => {
    if (items.length === 0) return
    onAprobar(pedido.id, items)
    onClose()
  }

  const handleCancelar = () => {
    onCancelar(pedido.id, motivo)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Pedido #{pedido.id} — {cliente?.nombre}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="alert alert-info mb-4">
            Podés modificar cantidades antes de aprobar. Poner cantidad en 0 elimina el ítem.
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 0', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>Producto</th>
                <th style={{ textAlign: 'center', padding: '8px 0', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>Cant. solicitada</th>
                <th style={{ textAlign: 'center', padding: '8px 0', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>Cant. a aprobar</th>
                <th style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.items.map(orig => {
                const actual = items.find(i => i.productoId === orig.productoId)
                const prod = productos.find(p => p.id === orig.productoId)
                return (
                  <tr key={orig.productoId}>
                    <td style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                      {orig.nombre}
                      <br />
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Stock: {prod?.stock ?? '?'}</span>
                    </td>
                    <td style={{ padding: '10px 0', textAlign: 'center', borderBottom: '1px solid #f1f5f9', color: '#94a3b8' }}>
                      {orig.cantidad}
                    </td>
                    <td style={{ padding: '10px 0', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>
                      <input
                        type="number"
                        min={0}
                        max={prod?.stock ?? 999}
                        value={actual?.cantidad ?? 0}
                        onChange={e => cambiarCantidad(orig.productoId, e.target.value)}
                        style={{ width: 70, padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: 6, textAlign: 'center' }}
                      />
                    </td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>
                      ${((actual?.cantidad ?? 0) * orig.precioUnitario).toLocaleString('es-AR')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="flex-between" style={{ padding: '12px 0', borderTop: '2px solid #e2e8f0', marginBottom: 20 }}>
            <span style={{ fontWeight: 600 }}>Total aprobado:</span>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#1e40af' }}>${total.toLocaleString('es-AR')}</span>
          </div>

          {cancelando && (
            <div>
              <div className="form-group">
                <label className="form-label">Motivo de cancelación</label>
                <textarea
                  className="form-textarea"
                  value={motivo}
                  onChange={e => setMotivo(e.target.value)}
                  placeholder="Explicá el motivo de la cancelación..."
                />
              </div>
            </div>
          )}

          {pedido.notas && (
            <div className="alert alert-warning">
              <strong>Notas del cliente:</strong> {pedido.notas}
            </div>
          )}
        </div>
        <div className="modal-footer">
          {!cancelando ? (
            <>
              <button className="btn btn-danger" onClick={() => setCancelando(true)}>
                Cancelar pedido
              </button>
              <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
              <button
                className="btn btn-success"
                onClick={handleAprobar}
                disabled={items.length === 0}
              >
                ✓ Aprobar pedido
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => setCancelando(false)}>Atrás</button>
              <button className="btn btn-danger" onClick={handleCancelar}>
                Confirmar cancelación
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PedidosSolicitados() {
  const { pedidos, aprobarPedido, cancelarPedido, getClienteById } = useApp()
  const [modal, setModal] = useState(null)

  const solicitados = pedidos.filter(p => p.estado === 'solicitado')

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Pedidos Solicitados</h2>
        <p className="page-subtitle">{solicitados.length} solicitudes pendientes de revisión</p>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {solicitados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <p className="empty-state-text">Sin solicitudes pendientes</p>
              <p className="empty-state-sub">¡Todas las solicitudes fueron procesadas!</p>
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
                    <th>Notas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitados.map(p => {
                    const cliente = getClienteById(p.clienteId)
                    return (
                      <tr key={p.id}>
                        <td><strong>#{p.id}</strong></td>
                        <td>{p.fechaCreacion}</td>
                        <td>{cliente?.nombre}</td>
                        <td style={{ color: '#64748b', fontSize: 12, maxWidth: 200 }}>
                          {p.items.map(i => `${i.nombre} ×${i.cantidad}`).join(', ')}
                        </td>
                        <td><strong>${p.total.toLocaleString('es-AR')}</strong></td>
                        <td style={{ color: '#94a3b8', fontSize: 12, maxWidth: 150 }}>
                          {p.notas || '—'}
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setModal(p)}
                          >
                            Revisar
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
        <ModalAprobar
          pedido={modal}
          cliente={getClienteById(modal.clienteId)}
          onAprobar={aprobarPedido}
          onCancelar={cancelarPedido}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
