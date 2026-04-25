(function () {
  const pagina = window.location.pathname.split('/').pop();

  const activos = {
    'menuPrincipal.html':       'inicio',
    'buscarPersonal.html':      'buscar',
    'vistaLibros.html':         'libro1',
    'nuevoRegistro.html':       'libro1',
    'editar.html':              'libro1',
    'administrarUsuarios.html': 'usuarios',
    'administrarLibros.html':   'libros',
    'administrarCajas.html':    'cajas',
    'administrarYears.html':    'anios',
  };

  const activo = activos[pagina] || '';
  const a = function (id) { return id === activo ? ' active' : ''; };

  document.body.insertAdjacentHTML('afterbegin',
    '<div class="overlay" id="overlay" onclick="cerrarMenu()"></div>' +
    '<aside class="sidebar" id="sidebar">' +
      '<div class="sidebar-header">' +
        '<img src="../asset/imagenes/logo_serviarpe.png" alt="Logo" />' +
        '<span class="sidebar-nombre">SERVIARPE S.A.S ESP</span>' +
      '</div>' +
      '<p class="sidebar-seccion">GENERAL</p>' +
      '<nav class="sidebar-nav">' +
        '<a href="menuPrincipal.html" class="nav-item' + a('inicio') + '">' +
          '<span class="nav-icon">🏠</span> Inicio' +
        '</a>' +
        '<a href="buscarPersonal.html" class="nav-item' + a('buscar') + '">' +
          '<span class="nav-icon">👤</span> Buscar personal' +
        '</a>' +
      '</nav>' +
      '<p class="sidebar-seccion">LIBROS</p>' +
      '<nav class="sidebar-nav">' +
        '<a href="vistaLibros.html" class="nav-item' + a('libro1') + '">' +
          '<span class="nav-icon">📘</span> Libro # 1' +
        '</a>' +
        '<a href="#" class="nav-item"><span class="nav-icon">📗</span> Libro # 2</a>' +
        '<a href="#" class="nav-item"><span class="nav-icon">📙</span> Libro # 3</a>' +
        '<a href="#" class="nav-item"><span class="nav-icon">📕</span> Libro # 4</a>' +
      '</nav>' +
      '<p class="sidebar-seccion">ADMINISTRAR</p>' +
      '<nav class="sidebar-nav">' +
        '<a href="administrarUsuarios.html" class="nav-item' + a('usuarios') + '">' +
          '<span class="nav-icon">👥</span> Usuarios' +
        '</a>' +
        '<a href="administrarLibros.html" class="nav-item' + a('libros') + '">' +
          '<span class="nav-icon">📚</span> Libros' +
        '</a>' +
        '<a href="administrarCajas.html" class="nav-item' + a('cajas') + '">' +
          '<span class="nav-icon">📦</span> Cajas' +
        '</a>' +
        '<a href="administrarYears.html" class="nav-item' + a('anios') + '">' +
          '<span class="nav-icon">📅</span> Años' +
        '</a>' +
      '</nav>' +
      '<a href="perfil.html" class="sidebar-footer">' +
        '<span class="user-icon">👤</span>' +
        '<span class="user-nombre">Administrador</span>' +
      '</a>' +
    '</aside>'
  );

  var main = document.querySelector('.main');
  if (main) {
    main.insertAdjacentHTML('afterbegin',
      '<header class="topbar">' +
        '<div class="topbar-center">' +
          '<img src="../asset/imagenes/logo_serviarpe.png" alt="Logo" class="topbar-logo" />' +
          '<h1 class="topbar-title">SERVIARPE S.A.S ESP</h1>' +
        '</div>' +
      '</header>'
    );
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
