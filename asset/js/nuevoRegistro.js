const path = require('path');
const db = require(path.join(process.cwd(), 'database'));

const params  = new URLSearchParams(window.location.search);
const libroId = parseInt(params.get('libro_id'));

(function inicializarFormulario() {
  // Mostrar nombre del libro en el subtítulo
  if (libroId) {
    const libro = db.prepare('SELECT * FROM libros WHERE id = ?').get(libroId);
    if (libro) {
      const sub = document.getElementById('nuevo-subtitulo');
      if (sub) sub.textContent = libro.nombre;
    }
  }

  // Poblar select de cajas
  const selectCaja = document.getElementById('selectCaja');
  db.prepare('SELECT * FROM cajas ORDER BY id').all().forEach(function (c) {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.numero + (c.ubicacion ? ' — ' + c.ubicacion : '');
    selectCaja.appendChild(opt);
  });

  // Poblar select de años
  const selectAnio = document.getElementById('selectAnio');
  db.prepare('SELECT * FROM anios ORDER BY anio DESC').all().forEach(function (a) {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = a.anio;
    selectAnio.appendChild(opt);
  });
})();

function crearRegistro(e) {
  e.preventDefault();
  const nombre   = document.getElementById('inputNombre').value.trim();
  const cedula   = document.getElementById('inputCedula').value.trim();
  const cargo    = document.getElementById('inputCargo').value.trim();
  const cajaId   = document.getElementById('selectCaja').value || null;
  const anioId   = document.getElementById('selectAnio').value || null;
  const posicion = document.getElementById('inputPosicion').value.trim();

  if (!nombre || !cedula) {
    Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'El nombre y la cédula son obligatorios.', confirmButtonColor: '#007ABF' });
    return;
  }

  try {
    db.prepare(
      'INSERT INTO personal (nombre, cedula, cargo, libro_id, caja_id, anio_id, posicion) VALUES (?,?,?,?,?,?,?)'
    ).run(nombre, cedula, cargo || null, libroId || null, cajaId, anioId, posicion || null);

    Swal.fire({ icon: 'success', title: '¡Registro creado!', timer: 1400, showConfirmButton: false })
      .then(() => { window.location.href = 'vistaLibros.html?libro_id=' + libroId; });
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'La cédula ya existe en el sistema.', confirmButtonColor: '#007ABF' });
  }
}

// Al cargar la página, actualiza el href del botón Cancelar
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const libroId = params.get("libro_id"); 

  const btnCancelar = document.getElementById("btnCancelar");

  if (libroId) {
    btnCancelar.href = `vistaLibros.html?libro_id=${libroId}`;
  } else {
    btnCancelar.href = "vistaLibros.html";
  }
});