const path = require('path');
const db = require(path.join(process.cwd(), 'database'));

function cargarPersonal() {
  const registros = db.prepare(
    'SELECT p.*, l.nombre AS libro_nombre, c.numero AS caja_numero, c.ubicacion AS caja_ubicacion ' +
    'FROM personal p ' +
    'LEFT JOIN libros l ON p.libro_id = l.id ' +
    'LEFT JOIN cajas c  ON p.caja_id  = c.id ' +
    'ORDER BY p.nombre'
  ).all();

  const tbody = document.querySelector('#tablaPersonal tbody');
  tbody.innerHTML = '';

  if (registros.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;padding:20px;">No hay registros de personal.</td></tr>';
    return;
  }

  registros.forEach(function (p) {
    const posicion = p.libro_nombre
      ? p.libro_nombre + (p.posicion ? ' - ' + p.posicion : '')
      : '—';
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td><span class="badge">' + p.id + '</span></td>' +
      '<td>' + p.nombre + '</td>' +
      '<td>' + (p.caja_numero  || '—') + '</td>' +
      '<td>' + (p.caja_ubicacion || '—') + '</td>' +
      '<td>' + posicion + '</td>';
    tbody.appendChild(tr);
  });
}

function filtrarTabla() {
  const input = document.getElementById('buscador').value.toLowerCase();
  document.querySelectorAll('#tablaPersonal tbody tr').forEach(fila => {
    fila.style.display = fila.textContent.toLowerCase().includes(input) ? '' : 'none';
  });
}

cargarPersonal();
