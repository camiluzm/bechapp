// ============================================================
// DATOS INICIALES — reemplazar con llamadas a API en v2
// ============================================================

export const initialUsers = [
  {
    id: 1,
    nombre: 'Carlos Vendedor',
    email: 'vendedor@bechapp.com',
    password: '1234',
    role: 'vendedor',
    saldo: 0,
  },
  {
    id: 2,
    nombre: 'Juan Pérez',
    email: 'juan@mail.com',
    password: '1234',
    role: 'cliente',
    saldo: 81000,
  },
  {
    id: 3,
    nombre: 'María García',
    email: 'maria@mail.com',
    password: '1234',
    role: 'cliente',
    saldo: 155000,
  },
  {
    id: 4,
    nombre: 'Lucas Torres',
    email: 'lucas@mail.com',
    password: '1234',
    role: 'cliente',
    saldo: 0,
  },
]

export const initialProductos = [
  { id: 1, nombre: 'Silla Ergonómica Pro', precio: 45000, stock: 20 },
  { id: 2, nombre: 'Mesa de Escritorio XL', precio: 85000, stock: 8 },
  { id: 3, nombre: 'Monitor 24" Full HD', precio: 120000, stock: 15 },
  { id: 4, nombre: 'Teclado Mecánico RGB', precio: 35000, stock: 30 },
  { id: 5, nombre: 'Mouse Inalámbrico', precio: 18000, stock: 50 },
  { id: 6, nombre: 'Auriculares Bluetooth', precio: 55000, stock: 12 },
  { id: 7, nombre: 'Webcam HD 1080p', precio: 28000, stock: 25 },
  { id: 8, nombre: 'Hub USB-C 7 puertos', precio: 22000, stock: 40 },
]

export const initialPedidos = [
  {
    id: 1,
    clienteId: 2,
    items: [
      { productoId: 1, nombre: 'Silla Ergonómica Pro', cantidad: 1, precioUnitario: 45000 },
      { productoId: 5, nombre: 'Mouse Inalámbrico', cantidad: 2, precioUnitario: 18000 },
    ],
    total: 81000,
    estado: 'solicitado',        // solicitado | aprobado | cancelado
    estadoEntrega: null,         // en_preparacion | en_reparto | entregado
    fechaCreacion: '2026-04-15',
    notas: 'Entrega en horario de mañana',
  },
  {
    id: 2,
    clienteId: 3,
    items: [
      { productoId: 3, nombre: 'Monitor 24" Full HD', cantidad: 1, precioUnitario: 120000 },
      { productoId: 4, nombre: 'Teclado Mecánico RGB', cantidad: 1, precioUnitario: 35000 },
    ],
    total: 155000,
    estado: 'aprobado',
    estadoEntrega: 'en_preparacion',
    fechaCreacion: '2026-04-14',
    notas: '',
  },
  {
    id: 3,
    clienteId: 4,
    items: [
      { productoId: 2, nombre: 'Mesa de Escritorio XL', cantidad: 1, precioUnitario: 85000 },
    ],
    total: 85000,
    estado: 'cancelado',
    estadoEntrega: null,
    fechaCreacion: '2026-04-12',
    notas: 'Sin stock suficiente al momento del pedido',
  },
  {
    id: 4,
    clienteId: 2,
    items: [
      { productoId: 6, nombre: 'Auriculares Bluetooth', cantidad: 1, precioUnitario: 55000 },
    ],
    total: 55000,
    estado: 'aprobado',
    estadoEntrega: 'entregado',
    fechaCreacion: '2026-04-10',
    notas: '',
  },
  {
    id: 5,
    clienteId: 3,
    items: [
      { productoId: 7, nombre: 'Webcam HD 1080p', cantidad: 2, precioUnitario: 28000 },
      { productoId: 8, nombre: 'Hub USB-C 7 puertos', cantidad: 1, precioUnitario: 22000 },
    ],
    total: 78000,
    estado: 'solicitado',
    estadoEntrega: null,
    fechaCreacion: '2026-04-17',
    notas: '',
  },
]

export const initialBugs = [
  {
    id: 1,
    titulo: 'Error en cálculo de totales con descuentos',
    descripcion: 'Cuando se aplica un descuento mayor al 50%, el total puede mostrar valores incorrectos.',
    prioridad: 'alta',
    estado: 'incompleto',
    fechaCreacion: '2026-04-17',
  },
  {
    id: 2,
    titulo: 'Mejora: Filtros en listado de pedidos',
    descripcion: 'Agregar filtros por fecha, estado y cliente en la vista de pedidos del vendedor.',
    prioridad: 'media',
    estado: 'incompleto',
    fechaCreacion: '2026-04-16',
  },
  {
    id: 3,
    titulo: 'Mejora: Exportar pedido a PDF',
    descripcion: 'Botón para descargar el detalle de un pedido en formato PDF.',
    prioridad: 'baja',
    estado: 'completo',
    fechaCreacion: '2026-04-10',
  },
]
