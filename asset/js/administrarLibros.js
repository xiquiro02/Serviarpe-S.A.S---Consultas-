const iconos = ['📘','📗','📙','📕','📓','📒','📔'];
let itemEditando = null;

function abrirModalNuevo() {
  itemEditando = null;
  document.getElementById('modalTitulo').textContent = 'Nuevo libro';
  document.getElementById('inputNombreLibro').value = '';
  document.getElementById('btnGuardar').textContent = 'Guardar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function abrirModalEditar(btn) {
  itemEditando = btn.closest('.lista-item');
  const nombre = itemEditando.querySelector('.item-nombre').textContent;
  document.getElementById('modalTitulo').textContent = 'Editar libro';
  document.getElementById('inputNombreLibro').value = nombre;
  document.getElementById('btnGuardar').textContent = 'Actualizar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('activo');
  itemEditando = null;
}

function guardarLibro() {
  const nombre = document.getElementById('inputNombreLibro').value.trim();
  if (!nombre) {
    Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'Por favor ingresa el nombre del libro.', confirmButtonColor: '#007ABF' });
    return;
  }
  const esEdicion = itemEditando !== null;
  if (itemEditando) {
    itemEditando.querySelector('.item-nombre').textContent = nombre;
  } else {
    const lista = document.getElementById('listaLibros');
    const icono = iconos[lista.children.length % iconos.length];
    const li = document.createElement('li');
    li.className = 'lista-item';
    li.innerHTML = `
      <div class="item-izq">
        <span class="item-icono">${icono}</span>
        <span class="item-nombre">${nombre}</span>
      </div>
      <div class="item-acciones">
        <button class="btn-editar" title="Editar" onclick="abrirModalEditar(this)">✏️</button>
        <button class="btn-eliminar" title="Eliminar" onclick="confirmarEliminar(this)">🗑️</button>
      </div>`;
    lista.appendChild(li);
  }
  cerrarModal();
  Swal.fire({ icon: 'success', title: esEdicion ? 'Libro actualizado' : 'Libro agregado', timer: 1400, showConfirmButton: false });
}

function confirmarEliminar(btn) {
  Swal.fire({
    title: '¿Eliminar este libro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      btn.closest('.lista-item').remove();
      Swal.fire({ icon: 'success', title: 'Libro eliminado', timer: 1400, showConfirmButton: false });
    }
  });
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) cerrarModal();
});
