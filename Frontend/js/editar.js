const params     = new URLSearchParams(window.location.search);
const registroId = parseInt(params.get('id'));
let libroIdRegistro = null;

(async function cargarRegistro() {
  if (!registroId) { window.location.href = 'menuPrincipal.html'; return; }

  const { ok, data: p } = await getPersonalById(registroId);
  if (!ok || !p) { window.location.href = 'menuPrincipal.html'; return; }

  libroIdRegistro = p.libro_id;

  const badge    = document.querySelector('.editar-badge');
  const nombreH2 = document.querySelector('.editar-nombre');
  if (badge)    badge.textContent    = p.id;
  if (nombreH2) nombreH2.textContent = p.nombre;

  document.getElementById('inputNombre').value   = p.nombre;
  document.getElementById('inputCedula').value   = p.cedula;
  document.getElementById('inputCargo').value    = p.cargo    || '';
  document.getElementById('inputPosicion').value = p.posicion || '';

  const selectCaja = document.getElementById('selectCaja');
  const optVaciaCaja = document.createElement('option');
  optVaciaCaja.value = ''; optVaciaCaja.textContent = '— Sin caja —';
  selectCaja.appendChild(optVaciaCaja);

  const { ok: okC, data: cajas } = await getCajas();
  if (okC && cajas) {
    cajas.forEach(function (c) {
      const opt = document.createElement('option');
      opt.value       = c.id;
      opt.textContent = c.numero + (c.ubicacion ? ' — ' + c.ubicacion : '');
      if (c.id === p.caja_id) opt.selected = true;
      selectCaja.appendChild(opt);
    });
  }

  const selectAnio = document.getElementById('selectAnio');
  const optVaciaAnio = document.createElement('option');
  optVaciaAnio.value = ''; optVaciaAnio.textContent = '— Sin año —';
  selectAnio.appendChild(optVaciaAnio);

  const { ok: okA, data: anios } = await getAnios();
  if (okA && anios) {
    anios.sort((a, b) => b.anio - a.anio).forEach(function (a) {
      const opt = document.createElement('option');
      opt.value       = a.id;
      opt.textContent = a.anio;
      if (a.id === p.anio_id) opt.selected = true;
      selectAnio.appendChild(opt);
    });
  }

  const btnVolver   = document.querySelector('.btn-volver');
  const btnCancelar = document.querySelector('.btn-cancelar');
  if (btnVolver   && p.libro_id) btnVolver.href   = 'vistaLibros.html?libro_id=' + p.libro_id;
  if (btnCancelar)               btnCancelar.href = p.libro_id ? 'vistaLibros.html?libro_id=' + p.libro_id : 'vistaLibros.html';
})();


async function guardarEdicion(e) {
  e.preventDefault();

  const nombre   = document.getElementById('inputNombre').value.trim();
  const cedula   = document.getElementById('inputCedula').value.trim();
  const cargo    = document.getElementById('inputCargo').value.trim();
  const cajaId   = document.getElementById('selectCaja').value;
  const anioId   = document.getElementById('selectAnio').value;
  const posicion = document.getElementById('inputPosicion').value.trim();

  if (!nombre || !cedula) {
    Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'El nombre y la cédula son obligatorios.', confirmButtonColor: '#007ABF' });
    return;
  }

  const { ok, data } = await updatePersonal(registroId, {
    nombre,
    cedula,
    cargo:    cargo    || null,
    caja_id:  cajaId   ? parseInt(cajaId)  : null,
    anio_id:  anioId   ? parseInt(anioId)  : null,
    posicion: posicion || null
  });

  if (ok) {
    await Swal.fire({ icon: 'success', title: '¡Guardado!', timer: 1400, showConfirmButton: false });
    window.location.href = 'vistaLibros.html?libro_id=' + (libroIdRegistro || '');
  } else {
    Swal.fire({ icon: 'error', title: 'Error', text: data.mensaje, confirmButtonColor: '#007ABF' });
  }
}
