//   Menú Hamburguesa JS

const sidebar  = document.getElementById('sidebar');
const overlay  = document.getElementById('overlay');
const btnMenu  = document.getElementById('btnMenu');

// Abrir / cerrar menú
function toggleMenu() {
  const abierto = sidebar.classList.toggle('abierto');
  overlay.classList.toggle('activo', abierto);
  btnMenu.classList.toggle('activo', abierto);
}

// Cerrar menú al hacer clic en el overlay
function cerrarMenu() {
  sidebar.classList.remove('abierto');
  overlay.classList.remove('activo');
  btnMenu.classList.remove('activo');
}

// Cerrar menú con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarMenu();
});

// Marcar item activo al hacer clic
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});