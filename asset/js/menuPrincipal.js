// ================================
// MENÚ HAMBURGUESA JS
// ================================

const sidebar = document.getElementById('sidebar'); // Obtiene el elemento del sidebar (menú lateral)
const overlay = document.getElementById('overlay'); // Obtiene el overlay (fondo oscuro que aparece al abrir el menú)
const btnMenu = document.getElementById('btnMenu'); // Obtiene el botón hamburguesa

// ================================
// ABRIR / CERRAR MENÚ
// ================================

function toggleMenu() { // Función que alterna el estado del menú
  // Alterna la clase 'abierto' en el sidebar
  // Si no la tiene → la agrega
  // Si la tiene → la quita
  const abierto = sidebar.classList.toggle('abierto');
  // Activa o desactiva el overlay según el estado del menú
  // Si abierto = true → agrega 'activo'
  // Si abierto = false → lo quita
  overlay.classList.toggle('activo', abierto);
  // Cambia el estado visual del botón hamburguesa
  btnMenu.classList.toggle('activo', abierto);
}


// ================================
// CERRAR MENÚ CON OVERLAY
// ================================

function cerrarMenu() { // Función para cerrar el menú manualmente
  // Quita la clase 'abierto' → oculta el sidebar
  sidebar.classList.remove('abierto');
  // Quita la clase 'activo' → oculta el overlay
  overlay.classList.remove('activo');
  // Quita el estado activo del botón
  btnMenu.classList.remove('activo');
}

// ================================
// CERRAR MENÚ CON TECLA ESC
// ================================

// Escucha eventos del teclado en toda la página
document.addEventListener('keydown', (e) => {
  // Si la tecla presionada es "Escape"
  if (e.key === 'Escape') {
    // Cierra el menú
    cerrarMenu();
  }
});


// ================================
// MARCAR OPCIÓN ACTIVA DEL MENÚ
// ================================

// Selecciona todos los elementos del menú (nav-item)
document.querySelectorAll('.nav-item').forEach(item => {
  // Agrega evento click a cada uno
  item.addEventListener('click', function () {
    // Recorre todos los items y les quita la clase 'active'
    document.querySelectorAll('.nav-item')
      .forEach(i => i.classList.remove('active'));
    // Agrega la clase 'active' SOLO al que se hizo clic
    this.classList.add('active');
  });
});