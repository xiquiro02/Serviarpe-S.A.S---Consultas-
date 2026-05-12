(async function () {
  try {
    var u = JSON.parse(localStorage.getItem('usuario') || '{}');
    document.querySelectorAll('.user-nombre').forEach(function (el) {
      if (u.nombre) el.textContent = u.nombre;
    });
  } catch (e) {}

  var navLibros = document.getElementById('sidebarLibros');
  if (!navLibros) return;

  var ICONOS = ['📘', '📗', '📙', '📕', '📓', '📒', '📔'];

  try {
    var params        = new URLSearchParams(window.location.search);
    var libroIdActivo = params.get('libro_id');

    var { ok, data: libros } = await getLibros();
    if (!ok || !libros) return;

    navLibros.innerHTML = '';
    libros.forEach(function (libro, i) {
      var a = document.createElement('a');
      a.href      = 'vistaLibros.html?libro_id=' + libro.id;
      a.className = 'nav-item' + (String(libro.id) === libroIdActivo ? ' active' : '');
      a.innerHTML = '<span class="nav-icon">' + ICONOS[i % ICONOS.length] + '</span> ' + libro.nombre;
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

(function () {
  try {
    var u = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (u.rol !== 'administrador') {
      document.querySelectorAll('.admin-only').forEach(function (el) {
        el.style.display = 'none';
      });
    }
  } catch (e) {}
})();
