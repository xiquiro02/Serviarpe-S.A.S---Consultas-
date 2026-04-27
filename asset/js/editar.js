// Guardar edición
function guardarEdicion(e) {
  e.preventDefault();
  const nombre = document.getElementById('inputNombre').value.trim();
  const cedula = document.getElementById('inputCedula').value.trim();

  if (!nombre || !cedula) {
    alert('El nombre y la cédula son obligatorios.');
    return;
  }
  alert('Registro actualizado correctamente.');
  window.location.href = 'vistaLibros.html';
}
