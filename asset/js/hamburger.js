// ================================ MENÚ HAMBURGUESA ================================
// Función para abrir/cerrar el menú lateral (sidebar)
function toggleMenu() {
  // Obtiene los elementos del DOM
  const sidebar = document.getElementById('sidebar'); // menú lateral
  const overlay = document.getElementById('overlay'); // fondo oscuro
  const btnMenu = document.getElementById('btnMenu'); // botón hamburguesa

  // Alterna la clase 'abierto' en el sidebar
  // Devuelve true si quedó abierto, false si se cerró
  const abierto = sidebar.classList.toggle('abierto');

  // Activa o desactiva el overlay dependiendo del estado del menú
  overlay.classList.toggle('activo', abierto);

  // Cambia el estado visual del botón (si existe)
  if (btnMenu) btnMenu.classList.toggle('activo', abierto);
}

// Función para cerrar el menú manualmente
function cerrarMenu() {

  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const btnMenu = document.getElementById('btnMenu');

  // Elimina las clases que muestran el menú
  sidebar.classList.remove('abierto');
  overlay.classList.remove('activo');

  // Quita el estado activo del botón
  if (btnMenu) btnMenu.classList.remove('activo');
}

// Evento global: detectar cuando se presiona una tecla
document.addEventListener('keydown', (e) => {
  // Si se presiona la tecla "Escape", se cierra el menú
  if (e.key === 'Escape') cerrarMenu();
});


// Manejo de navegación activa (resaltar opción seleccionada)
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function () {
    // Quita la clase 'active' de todos los items
    document.querySelectorAll('.nav-item')
      .forEach(i => i.classList.remove('active'));

    // Agrega la clase 'active' al elemento clickeado
    this.classList.add('active');
  });
});