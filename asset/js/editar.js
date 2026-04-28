const path = require('path');
const db = require(path.join(process.cwd(), 'database'));

const params      = new URLSearchParams(window.location.search);
const registroId  = parseInt(params.get('id'));

(function cargarRegistro() {
  if (!registroId) { window.location.href = 'menuPrincipal.html'; return; }

  const p = db.prepare('SELECT * FROM personal WHERE id = ?').get(registroId);
  if (!p) { window.location.href = 'menuPrincipal.html'; return; }

  // Encabezado dinámico
  const badge = document.querySelector('.editar-badge');
  if (badge) badge.textContent = p.id;
  const nombreH2 = document.querySelector('.editar-nombre');
  if (nombreH2) nombreH2.textContent = p.nombre;

  // Campos del formulario
  document.getElementById('inputNombre').value  = p.nombre;
  document.getElementById('inputCedula').value  = p.cedula;
  document.getElementById('inputCargo').value   = p.cargo    || '';
  document.getElementById('inputPosicion').value = p.posicion || '';

  // Poblar y seleccionar caja
  const selectCaja = document.getElementById('selectCaja');
  const optVaciaCaja = document.createElement('option');
  optVaciaCaja.value = ''; optVaciaCaja.textContent = '— Sin caja —';
  selectCaja.appendChild(optVaciaCaja);
  db.prepare('SELECT * FROM cajas ORDER BY id').all().forEach(function (c) {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.numero + (c.ubicacion ? ' — ' + c.ubicacion : '');
    if (c.id === p.caja_id) opt.selected = true;
    selectCaja.appendChild(opt);
  });

  // Poblar y seleccionar año
  const selectAnio = document.getElementById('selectAnio');
  const optVaciaAnio = document.createElement('option');
  optVaciaAnio.value = ''; optVaciaAnio.textContent = '— Sin año —';
  selectAnio.appendChild(optVaciaAnio);
  db.prepare('SELECT * FROM anios ORDER BY anio DESC').all().forEach(function (a) {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = a.anio;
    if (a.id === p.anio_id) opt.selected = true;
    selectAnio.appendChild(opt);
  });

  // Botones volver y cancelar al libro correspondiente
  const btnVolver = document.querySelector('.btn-volver');
  if (btnVolver && p.libro_id) btnVolver.href = 'vistaLibros.html?libro_id=' + p.libro_id;
  const btnCancelar = document.querySelector('.btn-cancelar');
  if (btnCancelar) btnCancelar.href = p.libro_id ? 'vistaLibros.html?libro_id=' + p.libro_id : 'vistaLibros.html';
})();

function guardarEdicion(e) {
  e.preventDefault();
  const nombre   = document.getElementById('inputNombre').value.trim();
  const cedula   = document.getElementById('inputCedula').value.trim();
  const cargo    = document.getElementById('inputCargo').value.trim();
  const cajaId   = document.getElementById('selectCaja').value   || null;
  const anioId   = document.getElementById('selectAnio').value   || null;
  const posicion = document.getElementById('inputPosicion').value.trim();

  if (!nombre || !cedula) {
    Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'El nombre y la cédula son obligatorios.', confirmButtonColor: '#007ABF' });
    return;
  }

  try {
    db.prepare(
      'UPDATE personal SET nombre=?, cedula=?, cargo=?, caja_id=?, anio_id=?, posicion=? WHERE id=?'
    ).run(nombre, cedula, cargo || null, cajaId, anioId, posicion || null, registroId);

    const p = db.prepare('SELECT libro_id FROM personal WHERE id = ?').get(registroId);
    Swal.fire({ icon: 'success', title: '¡Guardado!', timer: 1400, showConfirmButton: false })
      .then(() => { window.location.href = 'vistaLibros.html?libro_id=' + (p ? p.libro_id : ''); });
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'La cédula ya existe en el sistema.', confirmButtonColor: '#007ABF' });
  }
}
