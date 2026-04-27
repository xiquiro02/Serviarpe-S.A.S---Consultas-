// ================================
// MENÚ HAMBURGUESA
// ================================

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const btnMenu = document.getElementById('btnMenu');
  const abierto = sidebar.classList.toggle('abierto');
  overlay.classList.toggle('activo', abierto);
  if (btnMenu) btnMenu.classList.toggle('activo', abierto);
}

function cerrarMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const btnMenu = document.getElementById('btnMenu');
  sidebar.classList.remove('abierto');
  overlay.classList.remove('activo');
  if (btnMenu) btnMenu.classList.remove('activo');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarMenu();
});

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('.nav-item')
      .forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});
