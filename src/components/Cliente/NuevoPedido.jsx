import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function NuevoPedido() {
  const { currentUser, productos, crearPedido } = useApp()
  const navigate = useNavigate()

  const [carrito, setCarrito] = useState([]) // [{productoId, nombre, cantidad, precioUnitario}]
  const [productoSel, setProductoSel] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [notas, setNotas] = useState('')
  const [success, setSuccess] = useState(false)

  const total = carrito.reduce((s, i) => s + i.cantidad * i.precioUnitario, 0)

  const agregarItem = () => {
    if (!productoSel) return
    const prod = productos.find(p => p.id === Number(productoSel))
    if (!prod) return
    if (cantidad < 1 || cantidad > prod.stock) return

    setCarrito(prev => {
      const exist = prev.find(i => i.productoId === prod.id)
      if (exist) {
        return prev.map(i =>
          i.productoId === prod.id
            ? { ...i, cantidad: Math.min(i.cantidad + Number(cantidad), prod.stock) }
            : i
        )
      }
      return [...prev, {
        productoId: prod.id,
        nombre: prod.nombre,
        cantidad: Number(cantidad),
        precioUnitario: prod.precio,
      }]
    })
    setProductoSel('')
    setCantidad(1)
  }

  const quitarItem = productoId => {
    setCarrito(prev => prev.filter(i => i.productoId !== productoId))
  }

  const cambiarCantidad = (productoId, nuevaCantidad) => {
    const prod = productos.find(p => p.id === productoId)
    const val = Math.max(1, Math.min(Number(nuevaCantidad), prod?.stock ?? 999))
    setCarrito(prev =>
      prev.map(i => i.productoId === productoId ? { ...i, cantidad: val } : i)
    )
  }

  const handleSubmit = () => {
    if (carrito.length === 0) return
    crearPedido(currentUser.id, carrito, notas)
    setSuccess(true)
    setTimeout(() => navigate('/cliente/mis-pedidos'), 1500)
  }

  if (success) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#059669' }}>¡Pedido enviado!</h3>
          <p style={{ color: '#64748b', marginTop: 8 }}>Redirigiendo a tus pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Nuevo Pedido</h2>
        <p className="page-subtitle">Agregá productos a tu carrito y enviá la solicitud</p>
      </div>

      <div className="grid-2" style={{ gap: 20, alignItems: 'start' }}>
        {/* Panel agregar producto */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Seleccionar producto</span>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Producto</label>
              <select
                className="form-select"
                value={productoSel}
                onChange={e => setProductoSel(e.target.value)}
              >
                <option value="">— Elegir producto —</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — ${p.precio.toLocaleString('es-AR')} (stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            {productoSel && (() => {
              const prod = productos.find(p => p.id === Number(productoSel))
              return (
                <div className="alert alert-info" style={{ marginBottom: 12 }}>
                  Precio unitario: <strong>${prod.precio.toLocaleString('es-AR')}</strong> · Stock disponible: <strong>{prod.stock}</strong>
                </div>
              )
            })()}

            <div className="form-group">
              <label className="form-label">Cantidad</label>
              <input
                type="number"
                className="form-input"
                min={1}
                max={productoSel ? productos.find(p => p.id === Number(productoSel))?.stock : 999}
                value={cantidad}
                onChange={e => setCantidad(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary w-full"
              onClick={agregarItem}
              disabled={!productoSel}
            >
              + Agregar al carrito
            </button>

            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="form-label">Notas (opcional)</label>
              <textarea
                className="form-textarea"
                placeholder="Horario de entrega, instrucciones especiales..."
                value={notas}
                onChange={e => setNotas(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Carrito */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Carrito ({carrito.length})</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {carrito.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🛒</div>
                <p className="empty-state-text">Carrito vacío</p>
                <p className="empty-state-sub">Agregá productos desde el panel izquierdo</p>
              </div>
            ) : (
              <>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>P. Unit.</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {carrito.map(item => (
                        <tr key={item.productoId}>
                          <td style={{ maxWidth: 140 }}>{item.nombre}</td>
                          <td>
                            <input
                              type="number"
                              min={1}
                              value={item.cantidad}
                              onChange={e => cambiarCantidad(item.productoId, e.target.value)}
                              style={{ width: 60, padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: 6 }}
                            />
                          </td>
                          <td>${item.precioUnitario.toLocaleString('es-AR')}</td>
                          <td><strong>${(item.cantidad * item.precioUnitario).toLocaleString('es-AR')}</strong></td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => quitarItem(item.productoId)}
                            >✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0' }}>
                  <div className="flex-between" style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>Total del pedido:</span>
                    <span style={{ fontSize: 22, fontWeight: 700, color: '#1e40af' }}>
                      ${total.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <button
                    className="btn btn-success btn-lg w-full"
                    onClick={handleSubmit}
                    disabled={carrito.length === 0}
                  >
                    Enviar solicitud de pedido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
