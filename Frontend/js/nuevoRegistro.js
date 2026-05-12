const params  = new URLSearchParams(window.location.search);
const libroId = parseInt(params.get('libro_id'));

(async function inicializarFormulario() {
  if (libroId) {
    const { ok, data: libro } = await getLibroById(libroId);
    if (ok && libro) {
      const sub = document.getElementById('nuevo-subtitulo');
      if (sub) sub.textContent = libro.nombre;
    }
  }

  const selectCaja = document.getElementById('selectCaja');
  const { ok: okC, data: cajas } = await getCajas();
  if (okC && cajas) {
    cajas.forEach(function (c) {
      const opt = document.createElement('option');
      opt.value       = c.id;
      opt.textContent = c.numero + (c.ubicacion ? ' — ' + c.ubicacion : '');
      selectCaja.appendChild(opt);
    });
  }

  const selectAnio = document.getElementById('selectAnio');
  const { ok: okA, data: anios } = await getAnios();
  if (okA && anios) {
    anios.sort((a, b) => b.anio - a.anio).forEach(function (a) {
      const opt = document.createElement('option');
      opt.value       = a.id;
      opt.textContent = a.anio;
      selectAnio.appendChild(opt);
    });
  }

  const btnCancelar = document.getElementById('btnCancelar');
  if (btnCancelar) btnCancelar.href = libroId ? 'vistaLibros.html?libro_id=' + libroId : 'vistaLibros.html';
})();


async function crearRegistro(e) {
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

  const { ok, data } = await createPersonal({
    nombre,
    cedula,
    cargo:    cargo    || null,
    libro_id: libroId  || null,
    caja_id:  cajaId   ? parseInt(cajaId)  : null,
    anio_id:  anioId   ? parseInt(anioId)  : null,
    posicion: posicion || null
  });

  if (ok) {
    await Swal.fire({ icon: 'success', title: '¡Registro creado!', timer: 1400, showConfirmButton: false });
    window.location.href = 'vistaLibros.html?libro_id=' + libroId;
  } else {
    Swal.fire({ icon: 'error', title: 'Error', text: data.mensaje, confirmButtonColor: '#007ABF' });
  }
}
