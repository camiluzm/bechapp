import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const ESTADO_BADGE = {
  solicitado: 'badge badge-yellow',
  aprobado: 'badge badge-green',
  cancelado: 'badge badge-red',
}

const DELIVERY_STEPS = ['en_preparacion', 'en_reparto', 'entregado']
const DELIVERY_LABEL = {
  en_preparacion: 'En preparación',
  en_reparto: 'En reparto',
  entregado: 'Entregado',
}

function DeliveryBar({ estado }) {
  if (!estado) return null
  const current = DELIVERY_STEPS.indexOf(estado)
  return (
    <div className="delivery-progress" style={{ marginTop: 8 }}>
      {DELIVERY_STEPS.map((step, i) => (
        <div
          key={step}
          className={`dp-step ${i < current ? 'done' : ''} ${i === current ? 'current' : ''}`}
        >
          {DELIVERY_LABEL[step]}
        </div>
      ))}
    </div>
  )
}

function PedidoDetalle({ pedido, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Pedido #{pedido.id}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="flex-between mb-4">
            <span className="text-muted text-sm">Fecha: {pedido.fechaCreacion}</span>
            <span className={ESTADO_BADGE[pedido.estado]}>
              {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
            </span>
          </div>

          {pedido.estado === 'aprobado' && pedido.estadoEntrega && (
            <div className="mb-4">
              <p className="form-label mb-3">Estado de entrega</p>
              <DeliveryBar estado={pedido.estadoEntrega} />
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 0', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>Producto</th>
                <th style={{ textAlign: 'center', padding: '8px 0', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>Cant.</th>
                <th style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>P. Unit.</th>
                <th style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.items.map(item => (
                <tr key={item.productoId}>
                  <td style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>{item.nombre}</td>
                  <td style={{ padding: '10px 0', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>{item.cantidad}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>${item.precioUnitario.toLocaleString('es-AR')}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>${(item.cantidad * item.precioUnitario).toLocaleString('es-AR')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex-between" style={{ marginTop: 16, paddingTop: 12, borderTop: '2px solid #e2e8f0' }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#1e40af' }}>${pedido.total.toLocaleString('es-AR')}</span>
          </div>

          {pedido.notas && (
            <div className="alert alert-info mt-4">
              <strong>Notas:</strong> {pedido.notas}
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

export default function MisPedidos() {
  const { currentUser, pedidos } = useApp()
  const [filtro, setFiltro] = useState('todos')
  const [pedidoDetalle, setPedidoDetalle] = useState(null)

  const misPedidos = pedidos.filter(p => p.clienteId === currentUser.id)
  const filtrados = filtro === 'todos' ? misPedidos : misPedidos.filter(p => p.estado === filtro)

  return (
    <div>
      <div className="page-header flex-between">
        <div>
          <h2 className="page-title">Mis Pedidos</h2>
          <p className="page-subtitle">{misPedidos.length} pedidos en total</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['todos', 'solicitado', 'aprobado', 'cancelado'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filtro === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFiltro(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {filtrados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <p className="empty-state-text">No hay pedidos</p>
              <p className="empty-state-sub">
                {filtro === 'todos' ? 'Todavía no realizaste ningún pedido' : `Sin pedidos con estado "${filtro}"`}
              </p>
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
                    <th>Estado</th>
                    <th>Entrega</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map(p => (
                    <tr key={p.id}>
                      <td><strong>#{p.id}</strong></td>
                      <td>{p.fechaCreacion}</td>
                      <td style={{ maxWidth: 200 }}>
                        <span style={{ color: '#64748b', fontSize: 12 }}>
                          {p.items.map(i => `${i.nombre} x${i.cantidad}`).join(', ')}
                        </span>
                      </td>
                      <td><strong>${p.total.toLocaleString('es-AR')}</strong></td>
                      <td>
                        <span className={ESTADO_BADGE[p.estado]}>
                          {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                        </span>
                      </td>
                      <td>
                        {p.estadoEntrega ? (
                          <span className={
                            p.estadoEntrega === 'entregado' ? 'badge badge-green' :
                            p.estadoEntrega === 'en_reparto' ? 'badge badge-yellow' :
                            'badge badge-blue'
                          }>
                            {DELIVERY_LABEL[p.estadoEntrega]}
                          </span>
                        ) : <span className="text-muted text-sm">—</span>}
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setPedidoDetalle(p)}
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {pedidoDetalle && (
        <PedidoDetalle pedido={pedidoDetalle} onClose={() => setPedidoDetalle(null)} />
      )}
    </div>
  )
}
