// ================================ CARGA DINÁMICA DEL SIDEBAR ================================
(function () {

  var db;

  try {
    // Se importa el módulo path y la base de datos local
    var path = require('path');
    db = require(path.join(process.cwd(), 'database'));
  } catch (e) {
    // Si hay error al conectar con la BD, se muestra en consola y se detiene
    console.error('sidebar.js - error BD:', e);
    return;
  }

  // Lista de iconos que se asignarán a cada libro
  var ICONOS = ['📘', '📗', '📙', '📕', '📓', '📒', '📔'];


  // ================================ MOSTRAR NOMBRE DEL USUARIO ================================
  try {
    // Se obtiene el usuario guardado en localStorage
    var u = JSON.parse(localStorage.getItem('usuario') || '{}');

    // Se actualiza el nombre en todos los elementos con clase .user-nombre
    document.querySelectorAll('.user-nombre').forEach(function (el) {
      if (u.nombre) el.textContent = u.nombre;
    });

  } catch (e) {
    // Si falla el parseo, no hace nada
  }


  // ================================ CARGAR LIBROS EN EL SIDEBAR ================================
  var navLibros = document.getElementById('sidebarLibros');

  // Si no existe el contenedor, se detiene
  if (!navLibros) return;

  try {
    // Se obtiene el parámetro libro_id de la URL
    var params = new URLSearchParams(window.location.search);
    var libroIdActivo = params.get('libro_id');

    // Se consultan los libros en la base de datos
    var libros = db.prepare('SELECT * FROM libros ORDER BY id').all();

    // Se limpia el contenido previo
    navLibros.innerHTML = '';

    // Se recorre cada libro
    libros.forEach(function (libro, i) {

      // Se asigna un icono de forma cíclica
      var icono = ICONOS[i % ICONOS.length];

      // Se crea el elemento <a> para el menú
      var a = document.createElement('a');

      // URL que lleva a la vista del libro
      a.href = 'vistaLibros.html?libro_id=' + libro.id;

      // Se agrega clase 'active' si es el libro actual
      a.className = 'nav-item' + (String(libro.id) === libroIdActivo ? ' active' : '');

      // Contenido del botón (icono + nombre)
      a.innerHTML = '<span class="nav-icon">' + icono + '</span> ' + libro.nombre;

      // Se agrega al sidebar
      navLibros.appendChild(a);
    });

  } catch (e) {
    // Si ocurre error al cargar libros
    console.error('Error cargando libros en sidebar:', e);
  }

})();


// ================================ MENÚ HAMBURGUESA ================================

// Abre o cierra el menú lateral
function toggleMenu() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('overlay');
  var btnMenu = document.getElementById('btnMenu');

  // Alterna la clase "abierto"
  var abierto = sidebar.classList.toggle('abierto');

  // Activa o desactiva el fondo oscuro
  overlay.classList.toggle('activo', abierto);

  // Cambia el estado visual del botón
  if (btnMenu) btnMenu.classList.toggle('activo', abierto);
}


// Cierra el menú completamente
function cerrarMenu() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('overlay');
  var btnMenu = document.getElementById('btnMenu');

  sidebar.classList.remove('abierto');
  overlay.classList.remove('activo');

  if (btnMenu) btnMenu.classList.remove('activo');
}


// Permite cerrar el menú con la tecla ESC
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') cerrarMenu();
});


// ================================ CONTROL DE ACCESO (ROL USUARIO) ================================
(function () {
  try {
    // Se obtiene el usuario actual
    var u = JSON.parse(localStorage.getItem('usuario') || '{}');

    // Si NO es administrador
    if (u.rol !== 'administrador') {

      // Se ocultan todos los elementos con clase .admin-only
      document.querySelectorAll('.admin-only').forEach(function (el) {
        el.style.display = 'none';
      });
    }

  } catch (e) {
    // Si hay error, no hace nada
  }
})();