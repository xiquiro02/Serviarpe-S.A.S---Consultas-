let filaEditando = null;
let contadorId = 4;

function abrirModalNuevo() {
  filaEditando = null;
  document.getElementById('modalTitulo').textContent = 'Nueva caja';
  document.getElementById('inputNumero').value = '';
  document.getElementById('inputUbicacion').value = '';
  document.getElementById('btnGuardar').textContent = 'Guardar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function abrirModalEditar(btn) {
  filaEditando = btn.closest('tr');
  const celdas = filaEditando.querySelectorAll('td');
  document.getElementById('modalTitulo').textContent = 'Editar caja';
  document.getElementById('inputNumero').value = celdas[1].textContent.trim();
  document.getElementById('inputUbicacion').value = celdas[2].textContent.trim();
  document.getElementById('btnGuardar').textContent = 'Actualizar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('activo');
  filaEditando = null;
}

function guardarCaja() {
  const numero = document.getElementById('inputNumero').value.trim();
  const ubicacion = document.getElementById('inputUbicacion').value.trim();
  if (!numero || !ubicacion) {
    Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Por favor completa el número y la ubicación de la caja.', confirmButtonColor: '#007ABF' });
    return;
  }
  const esEdicion = filaEditando !== null;
  if (filaEditando) {
    const celdas = filaEditando.querySelectorAll('td');
    celdas[1].textContent = numero;
    celdas[2].textContent = ubicacion;
  } else {
    const tbody = document.querySelector('#tablaCajas tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge">${contadorId}</span></td>
      <td>${numero}</td>
      <td>${ubicacion}</td>
      <td class="acciones-td">
        <button class="btn-editar" title="Editar" onclick="abrirModalEditar(this)">✏️</button>
        <button class="btn-eliminar" title="Eliminar" onclick="confirmarEliminar(this)">🗑️</button>
      </td>`;
    tbody.appendChild(tr);
    contadorId++;
  }
  cerrarModal();
  Swal.fire({ icon: 'success', title: esEdicion ? 'Caja actualizada' : 'Caja agregada', timer: 1400, showConfirmButton: false });
}

function confirmarEliminar(btn) {
  Swal.fire({
    title: '¿Eliminar esta caja?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      btn.closest('tr').remove();
      Swal.fire({ icon: 'success', title: 'Caja eliminada', timer: 1400, showConfirmButton: false });
    }
  });
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) cerrarModal();
});
