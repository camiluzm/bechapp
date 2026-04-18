import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const PRIORIDAD_BADGE = {
  alta: 'badge priority-alta',
  media: 'badge priority-media',
  baja: 'badge priority-baja',
}

const PRIORIDAD_LABEL = { alta: 'Alta', media: 'Media', baja: 'Baja' }

function ModalNuevo({ onCrear, onClose }) {
  const [form, setForm] = useState({ titulo: '', descripcion: '', prioridad: 'media' })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.titulo.trim()) return
    onCrear(form.titulo.trim(), form.descripcion.trim(), form.prioridad)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Nuevo reporte</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input
                className="form-input"
                value={form.titulo}
                onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                placeholder="Descripción breve del bug o mejora"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-textarea"
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                placeholder="Detallá el problema o la mejora propuesta..."
                style={{ minHeight: 100 }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Prioridad</label>
              <select
                className="form-select"
                value={form.prioridad}
                onChange={e => setForm(f => ({ ...f, prioridad: e.target.value }))}
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Crear reporte</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalEditar({ bug, onActualizar, onClose }) {
  const [form, setForm] = useState({
    titulo: bug.titulo,
    descripcion: bug.descripcion,
    prioridad: bug.prioridad,
    estado: bug.estado,
  })

  const handleSubmit = e => {
    e.preventDefault()
    onActualizar(bug.id, form)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Editar reporte</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Título</label>
              <input
                className="form-input"
                value={form.titulo}
                onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-textarea"
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                style={{ minHeight: 100 }}
              />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Prioridad</label>
                <select
                  className="form-select"
                  value={form.prioridad}
                  onChange={e => setForm(f => ({ ...f, prioridad: e.target.value }))}
                >
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={form.estado}
                  onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
                >
                  <option value="incompleto">Incompleto</option>
                  <option value="completo">Completo</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function BugsMejoras() {
  const { bugs, crearBug, actualizarBug, eliminarBug } = useApp()
  const [modalNuevo, setModalNuevo] = useState(false)
  const [editando, setEditando] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroPrioridad, setFiltroPrioridad] = useState('todos')
  const [confirmDelete, setConfirmDelete] = useState(null)

  let filtrados = bugs
  if (filtroEstado !== 'todos') filtrados = filtrados.filter(b => b.estado === filtroEstado)
  if (filtroPrioridad !== 'todos') filtrados = filtrados.filter(b => b.prioridad === filtroPrioridad)

  const incompletos = bugs.filter(b => b.estado === 'incompleto').length
  const completos = bugs.filter(b => b.estado === 'completo').length

  return (
    <div>
      <div className="page-header flex-between">
        <div>
          <h2 className="page-title">Bugs y Mejoras</h2>
          <p className="page-subtitle">
            {incompletos} pendientes · {completos} resueltos
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalNuevo(true)}>
          + Nuevo reporte
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['todos', 'incompleto', 'completo'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filtroEstado === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFiltroEstado(f)}
            >
              {f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
          {['todos', 'alta', 'media', 'baja'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filtroPrioridad === f ? 'btn-warning' : 'btn-ghost'}`}
              onClick={() => setFiltroPrioridad(f)}
            >
              {f === 'todos' ? 'Todas las prioridades' : PRIORIDAD_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de bugs */}
      {filtrados.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-state-icon">🎉</div>
              <p className="empty-state-text">
                {filtroEstado === 'todos' && filtroPrioridad === 'todos'
                  ? 'Sin reportes todavía'
                  : 'Sin reportes con ese filtro'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtrados.map(bug => (
            <div
              key={bug.id}
              className="card"
              style={{
                borderLeft: `4px solid ${
                  bug.prioridad === 'alta' ? '#dc2626' :
                  bug.prioridad === 'media' ? '#d97706' : '#059669'
                }`,
                opacity: bug.estado === 'completo' ? 0.7 : 1,
              }}
            >
              <div className="card-body">
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: 15,
                      textDecoration: bug.estado === 'completo' ? 'line-through' : 'none',
                      color: bug.estado === 'completo' ? '#94a3b8' : '#1e293b',
                    }}>
                      {bug.titulo}
                    </span>
                    <span className={PRIORIDAD_BADGE[bug.prioridad]}>
                      {PRIORIDAD_LABEL[bug.prioridad]}
                    </span>
                    <span className={bug.estado === 'completo' ? 'badge badge-green' : 'badge badge-yellow'}>
                      {bug.estado === 'completo' ? '✓ Completo' : '○ Incompleto'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => actualizarBug(bug.id, {
                        estado: bug.estado === 'completo' ? 'incompleto' : 'completo'
                      })}
                    >
                      {bug.estado === 'completo' ? 'Reabrir' : 'Marcar completo'}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setEditando(bug)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setConfirmDelete(bug.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                {bug.descripcion && (
                  <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>
                    {bug.descripcion}
                  </p>
                )}
                <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 8 }}>
                  Creado: {bug.fechaCreacion}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Eliminar reporte</span>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#64748b' }}>¿Estás seguro de que querés eliminar este reporte? Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button
                className="btn btn-danger"
                onClick={() => { eliminarBug(confirmDelete); setConfirmDelete(null) }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalNuevo && (
        <ModalNuevo onCrear={crearBug} onClose={() => setModalNuevo(false)} />
      )}

      {editando && (
        <ModalEditar
          bug={editando}
          onActualizar={actualizarBug}
          onClose={() => setEditando(null)}
        />
      )}
    </div>
  )
}
