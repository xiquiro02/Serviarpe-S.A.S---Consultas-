const path = require('path');
const db = require(path.join(process.cwd(), 'database'));

const params  = new URLSearchParams(window.location.search);
const libroId = parseInt(params.get('libro_id'));

function cargarVista() {
  const libro = libroId ? db.prepare('SELECT * FROM libros WHERE id = ?').get(libroId) : null;

  // Título dinámico
  const titulo = document.getElementById('pagina-titulo');
  if (titulo) titulo.textContent = 'Registros - ' + (libro ? libro.nombre.toUpperCase() : 'LIBRO');

  // Botón nuevo registro apunta al libro correcto
  const btnNuevo = document.querySelector('a.btn-nuevo');
  if (btnNuevo) btnNuevo.href = 'nuevoRegistro.html?libro_id=' + libroId;

  // Cargar registros
  const registros = libroId
    ? db.prepare(
        'SELECT p.*, c.numero AS caja_numero FROM personal p ' +
        'LEFT JOIN cajas c ON p.caja_id = c.id ' +
        'WHERE p.libro_id = ? ORDER BY p.id'
      ).all(libroId)
    : [];

  const tbody = document.querySelector('#tablaRegistros tbody');
  tbody.innerHTML = '';

  if (registros.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;padding:20px;">No hay registros en este libro.</td></tr>';
    return;
  }

  registros.forEach(function (p) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td><span class="badge azul">' + p.id + '</span></td>' +
      '<td>' + p.nombre + '</td>' +
      '<td>' + p.cedula + '</td>' +
      '<td>' + (p.cargo || '—') + '</td>' +
      '<td>' + (p.posicion || '—') + '</td>' +
      '<td>' +
        '<a href="editar.html?id=' + p.id + '" class="btn-editar">✏️ Editar</a>' +
        ' <button class="btn-eliminar" style="font-size:.8rem;padding:4px 8px;" onclick="eliminarRegistro(' + p.id + ')">🗑️</button>' +
      '</td>';
    tbody.appendChild(tr);
  });
}

function eliminarRegistro(id) {
  Swal.fire({
    title: '¿Eliminar este registro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      db.prepare('DELETE FROM personal WHERE id = ?').run(id);
      cargarVista();
      Swal.fire({ icon: 'success', title: 'Registro eliminado', timer: 1400, showConfirmButton: false });
    }
  });
}

function filtrarTabla() {
  const input = document.getElementById('buscador').value.toLowerCase();
  document.querySelectorAll('#tablaRegistros tbody tr').forEach(fila => {
    fila.style.display = fila.textContent.toLowerCase().includes(input) ? '' : 'none';
  });
}

cargarVista();
