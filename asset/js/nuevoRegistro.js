// Sidebar
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const btnMenu = document.getElementById('btnMenu');

function toggleMenu() {
  const abierto = sidebar.classList.toggle('abierto');
  overlay.classList.toggle('activo', abierto);
  btnMenu.classList.toggle('activo', abierto);
}

function cerrarMenu() {
  sidebar.classList.remove('abierto');
  overlay.classList.remove('activo');
  btnMenu.classList.remove('activo');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarMenu();
});

// Crear registro
function crearRegistro(e) {
  e.preventDefault();
  const nombre = document.getElementById('inputNombre').value.trim();
  const cedula = document.getElementById('inputCedula').value.trim();
  const cargo  = document.getElementById('inputCargo').value.trim();
  const libro  = document.getElementById('inputLibro').value.trim();

  if (!nombre || !cedula || !cargo || !libro) {
    alert('Por favor completa todos los campos.');
    return;
  }
  alert('Registro creado correctamente.');
  window.location.href = 'vistaLibros.html';
}
