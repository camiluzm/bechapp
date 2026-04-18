import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const DELIVERY_STEPS = ['en_preparacion', 'en_reparto', 'entregado']
const DELIVERY_LABEL = {
  en_preparacion: 'En preparación',
  en_reparto: 'En reparto',
  entregado: 'Entregado',
}
const DELIVERY_NEXT = {
  en_preparacion: 'en_reparto',
  en_reparto: 'entregado',
}
const DELIVERY_NEXT_LABEL = {
  en_preparacion: 'Marcar en reparto',
  en_reparto: 'Marcar entregado',
}

function DeliveryBar({ estado }) {
  const current = DELIVERY_STEPS.indexOf(estado)
  return (
    <div className="delivery-progress">
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

function ModalDetalle({ pedido, cliente, onActualizar, onClose }) {
  const nextEstado = DELIVERY_NEXT[pedido.estadoEntrega]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Pedido #{pedido.id} — {cliente?.nombre}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="mb-4">
            <p className="form-label mb-3">Estado de entrega</p>
            <DeliveryBar estado={pedido.estadoEntrega} />
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
                  <td style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>{item.nombre}</td>
                  <td style={{ padding: '10px 0', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>{item.cantidad}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>
                    ${(item.cantidad * item.precioUnitario).toLocaleString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex-between" style={{ paddingTop: 12, borderTop: '2px solid #e2e8f0' }}>
            <span style={{ fontWeight: 600 }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#1e40af' }}>${pedido.total.toLocaleString('es-AR')}</span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
          {nextEstado && (
            <button
              className="btn btn-primary"
              onClick={() => { onActualizar(pedido.id, nextEstado); onClose() }}
            >
              {DELIVERY_NEXT_LABEL[pedido.estadoEntrega]}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PedidosAprobados() {
  const { pedidos, actualizarEstadoEntrega, getClienteById } = useApp()
  const [modal, setModal] = useState(null)
  const [filtro, setFiltro] = useState('todos')

  const aprobados = pedidos.filter(p => p.estado === 'aprobado')
  const filtrados = filtro === 'todos' ? aprobados : aprobados.filter(p => p.estadoEntrega === filtro)

  return (
    <div>
      <div className="page-header flex-between">
        <div>
          <h2 className="page-title">Pedidos Aprobados</h2>
          <p className="page-subtitle">{aprobados.length} pedidos aprobados</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['todos', 'en_preparacion', 'en_reparto', 'entregado'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filtro === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFiltro(f)}
            >
              {f === 'todos' ? 'Todos' : DELIVERY_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {filtrados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <p className="empty-state-text">Sin pedidos</p>
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
                    <th>Estado entrega</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map(p => {
                    const cliente = getClienteById(p.clienteId)
                    const next = DELIVERY_NEXT[p.estadoEntrega]
                    return (
                      <tr key={p.id}>
                        <td><strong>#{p.id}</strong></td>
                        <td>{p.fechaCreacion}</td>
                        <td>{cliente?.nombre}</td>
                        <td style={{ color: '#64748b', fontSize: 12, maxWidth: 180 }}>
                          {p.items.map(i => `${i.nombre} ×${i.cantidad}`).join(', ')}
                        </td>
                        <td><strong>${p.total.toLocaleString('es-AR')}</strong></td>
                        <td>
                          <span className={
                            p.estadoEntrega === 'entregado' ? 'badge badge-green' :
                            p.estadoEntrega === 'en_reparto' ? 'badge badge-yellow' :
                            'badge badge-blue'
                          }>
                            {DELIVERY_LABEL[p.estadoEntrega]}
                          </span>
                        </td>
                        <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setModal(p)}
                          >
                            Detalle
                          </button>
                          {next && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => actualizarEstadoEntrega(p.id, next)}
                            >
                              {DELIVERY_NEXT_LABEL[p.estadoEntrega]}
                            </button>
                          )}
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
          onActualizar={actualizarEstadoEntrega}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
