let itemEditando = null;

function abrirModalNuevo() {
  itemEditando = null;
  document.getElementById('modalTitulo').textContent = 'Nuevo año';
  document.getElementById('inputYear').value = '';
  document.getElementById('btnGuardar').textContent = 'Guardar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function abrirModalEditar(btn) {
  itemEditando = btn.closest('.year-item');
  const valor = itemEditando.querySelector('.year-valor').textContent;
  document.getElementById('modalTitulo').textContent = 'Editar año';
  document.getElementById('inputYear').value = valor;
  document.getElementById('btnGuardar').textContent = 'Actualizar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('activo');
  itemEditando = null;
}

function guardarYear() {
  const valor = document.getElementById('inputYear').value.trim();
  if (!valor) {
    Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'Por favor ingresa un año válido.', confirmButtonColor: '#007ABF' });
    return;
  }
  const esEdicion = itemEditando !== null;
  if (itemEditando) {
    itemEditando.querySelector('.year-valor').textContent = valor;
  } else {
    const grid = document.getElementById('yearsGrid');
    const div = document.createElement('div');
    div.className = 'year-item';
    div.innerHTML = `
      <div class="year-izq">
        <span class="year-icono">📅</span>
        <span class="year-valor">${valor}</span>
      </div>
      <div class="year-acciones">
        <button class="btn-editar" title="Editar" onclick="abrirModalEditar(this)">✏️</button>
        <button class="btn-eliminar" title="Eliminar" onclick="confirmarEliminar(this)">🗑️</button>
      </div>`;
    grid.appendChild(div);
  }
  cerrarModal();
  Swal.fire({ icon: 'success', title: esEdicion ? 'Año actualizado' : 'Año agregado', timer: 1400, showConfirmButton: false });
}

function confirmarEliminar(btn) {
  Swal.fire({
    title: '¿Eliminar este año?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      btn.closest('.year-item').remove();
      Swal.fire({ icon: 'success', title: 'Año eliminado', timer: 1400, showConfirmButton: false });
    }
  });
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) cerrarModal();
});
