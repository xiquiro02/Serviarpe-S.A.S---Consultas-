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
