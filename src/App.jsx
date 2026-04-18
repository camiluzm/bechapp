import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Login from './components/Login/Login'
import Layout from './components/Layout/Layout'
import ClienteDashboard from './components/Cliente/ClienteDashboard'
import NuevoPedido from './components/Cliente/NuevoPedido'
import MisPedidos from './components/Cliente/MisPedidos'
import EstadoCuenta from './components/Cliente/EstadoCuenta'
import VendedorDashboard from './components/Vendedor/VendedorDashboard'
import PedidosSolicitados from './components/Vendedor/PedidosSolicitados'
import PedidosAprobados from './components/Vendedor/PedidosAprobados'
import PedidosCancelados from './components/Vendedor/PedidosCancelados'
import Clientes from './components/Vendedor/Clientes'
import BugsMejoras from './components/Bugs/BugsMejoras'

function ProtectedRoute({ children, role }) {
  const { currentUser } = useApp()
  if (!currentUser) return <Navigate to="/login" replace />
  if (role && currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'vendedor' ? '/vendedor' : '/cliente'} replace />
  }
  return children
}

function AppRoutes() {
  const { currentUser } = useApp()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          currentUser
            ? <Navigate to={currentUser.role === 'vendedor' ? '/vendedor' : '/cliente'} replace />
            : <Login />
        }
      />

      {/* Rutas CLIENTE */}
      <Route
        path="/cliente"
        element={<ProtectedRoute role="cliente"><Layout /></ProtectedRoute>}
      >
        <Route index element={<ClienteDashboard />} />
        <Route path="nuevo-pedido" element={<NuevoPedido />} />
        <Route path="mis-pedidos" element={<MisPedidos />} />
        <Route path="estado-cuenta" element={<EstadoCuenta />} />
        <Route path="bugs" element={<BugsMejoras />} />
      </Route>

      {/* Rutas VENDEDOR */}
      <Route
        path="/vendedor"
        element={<ProtectedRoute role="vendedor"><Layout /></ProtectedRoute>}
      >
        <Route index element={<VendedorDashboard />} />
        <Route path="pedidos-solicitados" element={<PedidosSolicitados />} />
        <Route path="pedidos-aprobados" element={<PedidosAprobados />} />
        <Route path="pedidos-cancelados" element={<PedidosCancelados />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="bugs" element={<BugsMejoras />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  )
}
