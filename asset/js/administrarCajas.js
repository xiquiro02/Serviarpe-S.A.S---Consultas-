const path = require('path');
const db = require(path.join(process.cwd(), 'database'));

// Solo administradores pueden acceder
(function () {
  try {
    var u = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (u.rol !== 'administrador') window.location.href = 'menuPrincipal.html';
  } catch (e) { window.location.href = 'menuPrincipal.html'; }
})();

let cajaEditandoId = null;

function cargarCajas() {
  const cajas = db.prepare('SELECT * FROM cajas ORDER BY id').all();
  const tbody = document.querySelector('#tablaCajas tbody');
  tbody.innerHTML = '';
  cajas.forEach(function (caja) {
    const tr = document.createElement('tr');
    tr.dataset.id = caja.id;
    tr.innerHTML =
      '<td><span class="badge">' + caja.id + '</span></td>' +
      '<td>' + caja.numero + '</td>' +
      '<td>' + (caja.ubicacion || '') + '</td>' +
      '<td class="acciones-td">' +
        '<button class="btn-editar" title="Editar" onclick="abrirModalEditar(this)">✏️</button>' +
        '<button class="btn-eliminar" title="Eliminar" onclick="confirmarEliminar(this)">🗑️</button>' +
      '</td>';
    tbody.appendChild(tr);
  });
}

function abrirModalNuevo() {
  cajaEditandoId = null;
  document.getElementById('modalTitulo').textContent = 'Nueva caja';
  document.getElementById('inputNumero').value = '';
  document.getElementById('inputUbicacion').value = '';
  document.getElementById('btnGuardar').textContent = 'Guardar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function abrirModalEditar(btn) {
  const fila = btn.closest('tr');
  cajaEditandoId = parseInt(fila.dataset.id);
  const celdas = fila.querySelectorAll('td');
  document.getElementById('modalTitulo').textContent = 'Editar caja';
  document.getElementById('inputNumero').value = celdas[1].textContent.trim();
  document.getElementById('inputUbicacion').value = celdas[2].textContent.trim();
  document.getElementById('btnGuardar').textContent = 'Actualizar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('activo');
  cajaEditandoId = null;
}

function guardarCaja() {
  const numero = document.getElementById('inputNumero').value.trim();
  const ubicacion = document.getElementById('inputUbicacion').value.trim();
  if (!numero || !ubicacion) {
    Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Por favor completa el número y la ubicación de la caja.', confirmButtonColor: '#007ABF' });
    return;
  }
  const esEdicion = cajaEditandoId !== null;
  if (esEdicion) {
    db.prepare('UPDATE cajas SET numero = ?, ubicacion = ? WHERE id = ?').run(numero, ubicacion, cajaEditandoId);
  } else {
    db.prepare('INSERT INTO cajas (numero, ubicacion) VALUES (?, ?)').run(numero, ubicacion);
  }
  cerrarModal();
  cargarCajas();
  Swal.fire({ icon: 'success', title: esEdicion ? 'Caja actualizada' : 'Caja agregada', timer: 1400, showConfirmButton: false });
}

function confirmarEliminar(btn) {
  const fila = btn.closest('tr');
  const id = parseInt(fila.dataset.id);
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
      db.prepare('DELETE FROM cajas WHERE id = ?').run(id);
      cargarCajas();
      Swal.fire({ icon: 'success', title: 'Caja eliminada', timer: 1400, showConfirmButton: false });
    }
  });
}

document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) cerrarModal();
});

cargarCajas();
