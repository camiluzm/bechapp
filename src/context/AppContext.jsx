import { createContext, useContext, useState } from 'react'
import {
  initialUsers,
  initialProductos,
  initialPedidos,
  initialBugs,
} from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState(initialUsers)
  const [productos] = useState(initialProductos)
  const [pedidos, setPedidos] = useState(initialPedidos)
  const [bugs, setBugs] = useState(initialBugs)

  // ── AUTH ──────────────────────────────────────────────────
  const login = (email, password) => {
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (user) { setCurrentUser(user); return user }
    return null
  }

  const logout = () => setCurrentUser(null)

  // ── PEDIDOS ───────────────────────────────────────────────
  const crearPedido = (clienteId, items, notas = '') => {
    const total = items.reduce((s, i) => s + i.cantidad * i.precioUnitario, 0)
    const nuevo = {
      id: Date.now(),
      clienteId,
      items,
      total,
      estado: 'solicitado',
      estadoEntrega: null,
      fechaCreacion: new Date().toISOString().split('T')[0],
      notas,
    }
    setPedidos(prev => [nuevo, ...prev])
    return nuevo
  }

  const aprobarPedido = (pedidoId, itemsModificados = null) => {
    setPedidos(prev =>
      prev.map(p => {
        if (p.id !== pedidoId) return p
        const items = itemsModificados ?? p.items
        const total = items.reduce((s, i) => s + i.cantidad * i.precioUnitario, 0)
        // Actualizar saldo del cliente
        setUsers(prevU =>
          prevU.map(u =>
            u.id === p.clienteId
              ? { ...u, saldo: u.saldo + total - (itemsModificados ? p.total : 0) }
              : u
          )
        )
        return { ...p, items, total, estado: 'aprobado', estadoEntrega: 'en_preparacion' }
      })
    )
  }

  const cancelarPedido = (pedidoId, motivo = '') => {
    setPedidos(prev =>
      prev.map(p =>
        p.id === pedidoId
          ? { ...p, estado: 'cancelado', notas: motivo || p.notas }
          : p
      )
    )
  }

  const actualizarEstadoEntrega = (pedidoId, nuevoEstado) => {
    setPedidos(prev =>
      prev.map(p =>
        p.id === pedidoId ? { ...p, estadoEntrega: nuevoEstado } : p
      )
    )
  }

  // ── BUGS ─────────────────────────────────────────────────
  const crearBug = (titulo, descripcion, prioridad) => {
    const nuevo = {
      id: Date.now(),
      titulo,
      descripcion,
      prioridad,
      estado: 'incompleto',
      fechaCreacion: new Date().toISOString().split('T')[0],
    }
    setBugs(prev => [nuevo, ...prev])
  }

  const actualizarBug = (bugId, changes) => {
    setBugs(prev => prev.map(b => (b.id === bugId ? { ...b, ...changes } : b)))
  }

  const eliminarBug = bugId => {
    setBugs(prev => prev.filter(b => b.id !== bugId))
  }

  // ── HELPERS ──────────────────────────────────────────────
  const getClienteById = id => users.find(u => u.id === id)
  const getPedidosCliente = clienteId => pedidos.filter(p => p.clienteId === clienteId)

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        productos,
        pedidos,
        bugs,
        login,
        logout,
        crearPedido,
        aprobarPedido,
        cancelarPedido,
        actualizarEstadoEntrega,
        crearBug,
        actualizarBug,
        eliminarBug,
        getClienteById,
        getPedidosCliente,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
