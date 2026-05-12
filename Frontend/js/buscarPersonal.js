async function cargarPersonal() {
  const { ok, data } = await getAllPersonal();
  if (!ok || !data) return;
  const tbody = document.querySelector('#tablaPersonal tbody');
  tbody.innerHTML = '';

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;padding:20px;">No hay registros de personal.</td></tr>';
    return;
  }

  data.forEach(function (p) {
    const posicion = p.libro_nombre
      ? p.libro_nombre + (p.posicion ? ' - ' + p.posicion : '')
      : '—';
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td><span class="badge">' + p.id + '</span></td>' +
      '<td>' + p.nombre + '</td>' +
      '<td>' + (p.caja_numero    || '—') + '</td>' +
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
