import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const CUENTAS = [
  { label: 'Carlos Vendedor', role: 'Vendedor', email: 'vendedor@bechapp.com', password: '1234', color: '#1e40af' },
  { label: 'Juan Pérez', role: 'Cliente', email: 'juan@mail.com', password: '1234', color: '#059669' },
  { label: 'María García', role: 'Cliente', email: 'maria@mail.com', password: '1234', color: '#059669' },
  { label: 'Lucas Torres', role: 'Cliente', email: 'lucas@mail.com', password: '1234', color: '#059669' },
]

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const user = login(form.email, form.password)
      if (user) {
        navigate(user.role === 'vendedor' ? '/vendedor' : '/cliente', { replace: true })
      } else {
        setError('Email o contraseña incorrectos')
        setLoading(false)
      }
    }, 300)
  }

  const cargarCuenta = cuenta => {
    setForm({ email: cuenta.email, password: cuenta.password })
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <h1>Bech<span>app</span></h1>
          <p>Sistema de gestión de pedidos</p>
        </div>

        {/* Acceso rápido */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
            Acceso rápido
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {CUENTAS.map(c => (
              <button
                key={c.email}
                type="button"
                onClick={() => cargarCuenta(c)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  background: form.email === c.email ? '#f0f9ff' : '#f8fafc',
                  border: `1px solid ${form.email === c.email ? '#93c5fd' : '#e2e8f0'}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all .15s',
                  width: '100%',
                }}
              >
                <div style={{
                  width: 30, height: 30,
                  borderRadius: '50%',
                  background: c.color,
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13, flexShrink: 0,
                }}>
                  {c.label[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.role} · {c.email}</div>
                </div>
                {form.email === c.email && (
                  <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600 }}>Seleccionado</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>o ingresá manualmente</span>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
        </div>

        {error && <div className="login-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
