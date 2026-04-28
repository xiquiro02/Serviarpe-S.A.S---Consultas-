const path = require('path');
const db = require(path.join(process.cwd(), 'database'));

// Solo administradores pueden acceder
(function () {
  try {
    var u = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (u.rol !== 'administrador') window.location.href = 'menuPrincipal.html';
  } catch (e) { window.location.href = 'menuPrincipal.html'; }
})();

let anioEditandoId = null;

function cargarAnios() {
  const anios = db.prepare('SELECT * FROM anios ORDER BY anio').all();
  const grid = document.getElementById('yearsGrid');
  grid.innerHTML = '';
  anios.forEach(function (anio) {
    const div = document.createElement('div');
    div.className = 'year-item';
    div.dataset.id = anio.id;
    div.innerHTML =
      '<div class="year-izq">' +
        '<span class="year-icono">📅</span>' +
        '<span class="year-valor">' + anio.anio + '</span>' +
      '</div>' +
      '<div class="year-acciones">' +
        '<button class="btn-editar" title="Editar" onclick="abrirModalEditar(this)">✏️</button>' +
        '<button class="btn-eliminar" title="Eliminar" onclick="confirmarEliminar(this)">🗑️</button>' +
      '</div>';
    grid.appendChild(div);
  });
}

function abrirModalNuevo() {
  anioEditandoId = null;
  document.getElementById('modalTitulo').textContent = 'Nuevo año';
  document.getElementById('inputYear').value = '';
  document.getElementById('btnGuardar').textContent = 'Guardar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function abrirModalEditar(btn) {
  const item = btn.closest('.year-item');
  anioEditandoId = parseInt(item.dataset.id);
  const valor = item.querySelector('.year-valor').textContent;
  document.getElementById('modalTitulo').textContent = 'Editar año';
  document.getElementById('inputYear').value = valor;
  document.getElementById('btnGuardar').textContent = 'Actualizar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('activo');
  anioEditandoId = null;
}

function guardarYear() {
  const valor = document.getElementById('inputYear').value.trim();
  if (!valor) {
    Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'Por favor ingresa un año válido.', confirmButtonColor: '#007ABF' });
    return;
  }
  const esEdicion = anioEditandoId !== null;
  if (esEdicion) {
    db.prepare('UPDATE anios SET anio = ? WHERE id = ?').run(valor, anioEditandoId);
  } else {
    db.prepare('INSERT INTO anios (anio) VALUES (?)').run(valor);
  }
  cerrarModal();
  cargarAnios();
  Swal.fire({ icon: 'success', title: esEdicion ? 'Año actualizado' : 'Año agregado', timer: 1400, showConfirmButton: false });
}

function confirmarEliminar(btn) {
  const item = btn.closest('.year-item');
  const id = parseInt(item.dataset.id);
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
      db.prepare('DELETE FROM anios WHERE id = ?').run(id);
      cargarAnios();
      Swal.fire({ icon: 'success', title: 'Año eliminado', timer: 1400, showConfirmButton: false });
    }
  });
}

document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) cerrarModal();
});

cargarAnios();
