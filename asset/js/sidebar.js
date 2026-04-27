// Carga dinámica del sidebar: nombre de usuario y libros desde la BD
(function () {
  var db;
  try {
    var path = require('path');
    db = require(path.join(process.cwd(), 'database'));
  } catch (e) { console.error('sidebar.js - error BD:', e); return; }

  var ICONOS = ['📘', '📗', '📙', '📕', '📓', '📒', '📔'];

  // Nombre del usuario desde localStorage
  try {
    var u = JSON.parse(localStorage.getItem('usuario') || '{}');
    document.querySelectorAll('.user-nombre').forEach(function (el) {
      if (u.nombre) el.textContent = u.nombre;
    });
  } catch (e) {}

  // Sección LIBROS dinámica
  var navLibros = document.getElementById('sidebarLibros');
  if (!navLibros) return;

  try {
    var params = new URLSearchParams(window.location.search);
    var libroIdActivo = params.get('libro_id');

    var libros = db.prepare('SELECT * FROM libros ORDER BY id').all();
    navLibros.innerHTML = '';

    libros.forEach(function (libro, i) {
      var icono = ICONOS[i % ICONOS.length];
      var a = document.createElement('a');
      a.href = 'vistaLibros.html?libro_id=' + libro.id;
      a.className = 'nav-item' + (String(libro.id) === libroIdActivo ? ' active' : '');
      a.innerHTML = '<span class="nav-icon">' + icono + '</span> ' + libro.nombre;
      navLibros.appendChild(a);
    });
  } catch (e) {
    console.error('Error cargando libros en sidebar:', e);
  }
})();

function toggleMenu() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('overlay');
  var btnMenu = document.getElementById('btnMenu');
  var abierto = sidebar.classList.toggle('abierto');
  overlay.classList.toggle('activo', abierto);
  if (btnMenu) btnMenu.classList.toggle('activo', abierto);
}

function cerrarMenu() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('overlay');
  var btnMenu = document.getElementById('btnMenu');
  sidebar.classList.remove('abierto');
  overlay.classList.remove('activo');
  if (btnMenu) btnMenu.classList.remove('activo');
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') cerrarMenu();
});
