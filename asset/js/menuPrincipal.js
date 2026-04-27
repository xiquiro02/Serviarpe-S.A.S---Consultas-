// ================================
// BASE DE DATOS
// ================================

const db = require('../../database');

const ICONOS_LIBROS = ['📘', '📗', '📙', '📕', '📓', '📒', '📔'];
const IMAGENES_LIBROS = ['libro_azul.png', 'libro_verde.png', 'libro_naranja.png'];

function cargarDashboard() {
  // Total de carpetas (registros de personal)
  const totalCarpetas = db.prepare('SELECT COUNT(*) as total FROM personal').get();
  document.getElementById('numCarpetas').textContent = totalCarpetas.total;

  // Total de cajas
  const totalCajas = db.prepare('SELECT COUNT(*) as total FROM cajas').get();
  document.getElementById('numCajas').textContent = totalCajas.total;

  // Rango de años
  const rangoAnios = db.prepare('SELECT MIN(anio) as min, MAX(anio) as max FROM anios').get();
  const spanAnios = document.getElementById('rangoAnios');
  if (rangoAnios.min && rangoAnios.max) {
    spanAnios.textContent = rangoAnios.min === rangoAnios.max
      ? rangoAnios.min
      : `${rangoAnios.min} – ${rangoAnios.max}`;
  } else {
    spanAnios.textContent = '—';
  }

  // Lista de libros
  const libros = db.prepare('SELECT * FROM libros ORDER BY id').all();

  // Grid de libros (contenido principal)
  const grid = document.getElementById('librosGrid');
  grid.innerHTML = '';
  if (libros.length === 0) {
    grid.innerHTML = '<p style="color:#888;grid-column:1/-1;text-align:center;">No hay libros registrados.</p>';
  } else {
    libros.forEach((libro, i) => {
      const img = IMAGENES_LIBROS[i % IMAGENES_LIBROS.length];
      const a = document.createElement('a');
      a.href = 'vistaLibros.html';
      a.className = 'link-libros';
      a.innerHTML =
        '<div class="libro-card">' +
          '<img src="../asset/imagenes/' + img + '" alt="' + libro.nombre + '" class="libro-img" />' +
          '<span class="libro-titulo">' + libro.nombre.toUpperCase() + '</span>' +
        '</div>';
      grid.appendChild(a);
    });
  }

  // Sección LIBROS del sidebar
  const sidebarLibros = document.getElementById('sidebarLibros');
  sidebarLibros.innerHTML = '';
  libros.forEach((libro, i) => {
    const icono = ICONOS_LIBROS[i % ICONOS_LIBROS.length];
    const a = document.createElement('a');
    a.href = 'vistaLibros.html';
    a.className = 'nav-item';
    a.innerHTML = '<span class="nav-icon">' + icono + '</span> ' + libro.nombre;
    sidebarLibros.appendChild(a);
  });
}

cargarDashboard();
