(function () {
  try {
    var u = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (u.rol !== 'administrador') window.location.href = 'menuPrincipal.html';
  } catch (e) { window.location.href = 'menuPrincipal.html'; }
})();

const iconos = ['📘', '📗', '📙', '📕', '📓', '📒', '📔'];
let libroEditandoId = null;

async function cargarLibros() {
  const { ok, data } = await getLibros();
  if (!ok || !data) return;
  const lista = document.getElementById('listaLibros');
  lista.innerHTML = '';
  data.forEach(function (libro, i) {
    const li = document.createElement('li');
    li.className = 'lista-item';
    li.dataset.id = libro.id;
    li.innerHTML =
      '<div class="item-izq">' +
        '<span class="item-icono">' + iconos[i % iconos.length] + '</span>' +
        '<span class="item-nombre">' + libro.nombre + '</span>' +
      '</div>' +
      '<div class="item-acciones">' +
        '<button class="btn-editar" title="Editar" onclick="abrirModalEditar(this)">✏️</button>' +
        '<button class="btn-eliminar" title="Eliminar" onclick="confirmarEliminar(this)">🗑️</button>' +
      '</div>';
    lista.appendChild(li);
  });
}

function abrirModalNuevo() {
  libroEditandoId = null;
  document.getElementById('modalTitulo').textContent = 'Nuevo libro';
  document.getElementById('inputNombreLibro').value  = '';
  document.getElementById('btnGuardar').textContent  = 'Guardar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function abrirModalEditar(btn) {
  const item = btn.closest('.lista-item');
  libroEditandoId = parseInt(item.dataset.id);
  document.getElementById('modalTitulo').textContent     = 'Editar libro';
  document.getElementById('inputNombreLibro').value      = item.querySelector('.item-nombre').textContent;
  document.getElementById('btnGuardar').textContent      = 'Actualizar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('activo');
  libroEditandoId = null;
}

async function guardarLibro() {
  const nombre = document.getElementById('inputNombreLibro').value.trim();
  if (!nombre) {
    Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'Por favor ingresa el nombre del libro.', confirmButtonColor: '#007ABF' });
    return;
  }
  const esEdicion   = libroEditandoId !== null;
  const { ok, data } = esEdicion
    ? await updateLibro(libroEditandoId, nombre)
    : await createLibro(nombre);

  if (!ok) {
    Swal.fire({ icon: 'error', title: 'Error', text: data.mensaje, confirmButtonColor: '#007ABF' });
    return;
  }
  cerrarModal();
  cargarLibros();
  Swal.fire({ icon: 'success', title: esEdicion ? 'Libro actualizado' : 'Libro agregado', timer: 1400, showConfirmButton: false });
}

function confirmarEliminar(btn) {
  const item = btn.closest('.lista-item');
  const id   = parseInt(item.dataset.id);
  Swal.fire({
    title: '¿Eliminar este libro?',
    text: 'Se eliminarán también los registros de personal asociados.',
    icon: 'warning', showCancelButton: true,
    confirmButtonColor: '#e74c3c', cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar'
  }).then(async result => {
    if (!result.isConfirmed) return;
    const { ok } = await deleteLibro(id);
    if (!ok) return;
    cargarLibros();
    Swal.fire({ icon: 'success', title: 'Libro eliminado', timer: 1400, showConfirmButton: false });
  });
}

document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) cerrarModal();
});

cargarLibros();
