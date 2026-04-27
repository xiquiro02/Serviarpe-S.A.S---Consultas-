const path = require('path');
const db = require(path.join(process.cwd(), 'database'));
const iconos = ['📘', '📗', '📙', '📕', '📓', '📒', '📔'];
let libroEditandoId = null;

function cargarLibros() {
  const libros = db.prepare('SELECT * FROM libros ORDER BY id').all();
  const lista = document.getElementById('listaLibros');
  lista.innerHTML = '';
  libros.forEach(function (libro, i) {
    const icono = iconos[i % iconos.length];
    const li = document.createElement('li');
    li.className = 'lista-item';
    li.dataset.id = libro.id;
    li.innerHTML =
      '<div class="item-izq">' +
        '<span class="item-icono">' + icono + '</span>' +
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
  document.getElementById('inputNombreLibro').value = '';
  document.getElementById('btnGuardar').textContent = 'Guardar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function abrirModalEditar(btn) {
  const item = btn.closest('.lista-item');
  libroEditandoId = parseInt(item.dataset.id);
  const nombre = item.querySelector('.item-nombre').textContent;
  document.getElementById('modalTitulo').textContent = 'Editar libro';
  document.getElementById('inputNombreLibro').value = nombre;
  document.getElementById('btnGuardar').textContent = 'Actualizar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('activo');
  libroEditandoId = null;
}

function guardarLibro() {
  const nombre = document.getElementById('inputNombreLibro').value.trim();
  if (!nombre) {
    Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'Por favor ingresa el nombre del libro.', confirmButtonColor: '#007ABF' });
    return;
  }
  const esEdicion = libroEditandoId !== null;
  if (esEdicion) {
    db.prepare('UPDATE libros SET nombre = ? WHERE id = ?').run(nombre, libroEditandoId);
  } else {
    db.prepare('INSERT INTO libros (nombre) VALUES (?)').run(nombre);
  }
  cerrarModal();
  cargarLibros();
  Swal.fire({ icon: 'success', title: esEdicion ? 'Libro actualizado' : 'Libro agregado', timer: 1400, showConfirmButton: false });
}

function confirmarEliminar(btn) {
  const item = btn.closest('.lista-item');
  const id = parseInt(item.dataset.id);
  Swal.fire({
    title: '¿Eliminar este libro?',
    text: 'Se eliminarán también los registros de personal asociados.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      db.prepare('DELETE FROM personal WHERE libro_id = ?').run(id);
      db.prepare('DELETE FROM libros WHERE id = ?').run(id);
      cargarLibros();
      Swal.fire({ icon: 'success', title: 'Libro eliminado', timer: 1400, showConfirmButton: false });
    }
  });
}

document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) cerrarModal();
});

cargarLibros();
