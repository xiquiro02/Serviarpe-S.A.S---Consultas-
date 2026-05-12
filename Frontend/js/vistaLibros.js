const params  = new URLSearchParams(window.location.search);
const libroId = parseInt(params.get('libro_id'));

async function cargarVista() {
  const titulo   = document.getElementById('pagina-titulo');
  const btnNuevo = document.querySelector('a.btn-nuevo');
  const tbody    = document.querySelector('#tablaRegistros tbody');

  if (libroId) {
    const { ok, data: libro } = await getLibroById(libroId);
    if (ok && libro && titulo) titulo.textContent = 'Registros - ' + libro.nombre.toUpperCase();
  }

  if (btnNuevo) btnNuevo.href = 'nuevoRegistro.html?libro_id=' + libroId;

  if (!libroId) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;padding:20px;">No se especificó un libro.</td></tr>';
    return;
  }

  const { ok, data: registros } = await getPersonalByLibro(libroId);
  if (!ok || !registros) return;
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
      '<td>' + (p.cargo    || '—') + '</td>' +
      '<td>' + (p.posicion || '—') + '</td>' +
      '<td>' +
        '<a href="editar.html?id=' + p.id + '" class="btn-editar">✏️ Editar</a>' +
        ' <button class="btn-eliminar" style="font-size:.8rem;padding:4px 8px;" onclick="eliminarRegistro(' + p.id + ')">🗑️</button>' +
      '</td>';
    tbody.appendChild(tr);
  });
}

async function eliminarRegistro(id) {
  Swal.fire({
    title: '¿Eliminar este registro?', text: 'Esta acción no se puede deshacer.',
    icon: 'warning', showCancelButton: true,
    confirmButtonColor: '#e74c3c', cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar'
  }).then(async result => {
    if (!result.isConfirmed) return;
    const { ok } = await deletePersonal(id);
    if (!ok) return;
    cargarVista();
    Swal.fire({ icon: 'success', title: 'Registro eliminado', timer: 1400, showConfirmButton: false });
  });
}

function filtrarTabla() {
  const input = document.getElementById('buscador').value.toLowerCase();
  document.querySelectorAll('#tablaRegistros tbody tr').forEach(fila => {
    fila.style.display = fila.textContent.toLowerCase().includes(input) ? '' : 'none';
  });
}

cargarVista();
