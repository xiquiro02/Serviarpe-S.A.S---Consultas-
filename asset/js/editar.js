// Importa el módulo 'path' para manejar rutas de archivos
const path = require('path');
// Importa la base de datos desde el archivo 'database'
const db = require(path.join(process.cwd(), 'database'));
// Obtiene los parámetros de la URL (por ejemplo: ?id=5)
const params = new URLSearchParams(window.location.search);
// Convierte el parámetro 'id' a número entero
const registroId = parseInt(params.get('id'));

// Función autoejecutable que carga la información del registro
(function cargarRegistro() {
  // Si no hay ID en la URL, redirige al menú principal
  if (!registroId) {
    window.location.href = 'menuPrincipal.html';
    return;
  }

  // Busca el registro en la tabla 'personal'
  const p = db.prepare('SELECT * FROM personal WHERE id = ?').get(registroId);
  // Si no existe el registro, redirige
  if (!p) {
    window.location.href = 'menuPrincipal.html';
    return;
  }

  // ===== ENCABEZADO DINÁMICO =====
  // Muestra el ID en el badge (círculo superior)
  const badge = document.querySelector('.editar-badge');
  if (badge) badge.textContent = p.id;

  // Muestra el nombre en el título
  const nombreH2 = document.querySelector('.editar-nombre');
  if (nombreH2) nombreH2.textContent = p.nombre;

  // ===== CARGA DE DATOS EN EL FORMULARIO =====
  document.getElementById('inputNombre').value  = p.nombre;
  document.getElementById('inputCedula').value = p.cedula;
  document.getElementById('inputCargo').value  = p.cargo || '';
  document.getElementById('inputPosicion').value = p.posicion || '';

  // ===== SELECT DE CAJAS =====

  const selectCaja = document.getElementById('selectCaja');

  // Opción vacía (sin caja)
  const optVaciaCaja = document.createElement('option');
  optVaciaCaja.value = '';
  optVaciaCaja.textContent = '— Sin caja —';
  selectCaja.appendChild(optVaciaCaja);

  // Carga todas las cajas desde la BD
  db.prepare('SELECT * FROM cajas ORDER BY id').all().forEach(function (c) {

    const opt = document.createElement('option');
    opt.value = c.id;

    // Muestra número y ubicación de la caja
    opt.textContent = c.numero + (c.ubicacion ? ' — ' + c.ubicacion : '');

    // Selecciona automáticamente la caja actual del registro
    if (c.id === p.caja_id) opt.selected = true;

    selectCaja.appendChild(opt);
  });

  // ===== SELECT DE AÑOS =====
  const selectAnio = document.getElementById('selectAnio');

  // Opción vacía (sin año)
  const optVaciaAnio = document.createElement('option');
  optVaciaAnio.value = '';
  optVaciaAnio.textContent = '— Sin año —';
  selectAnio.appendChild(optVaciaAnio);

  // Carga todos los años ordenados de más reciente a más antiguo
  db.prepare('SELECT * FROM anios ORDER BY anio DESC').all().forEach(function (a) {

    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = a.anio;

    // Selecciona el año actual del registro
    if (a.id === p.anio_id) opt.selected = true;

    selectAnio.appendChild(opt);
  });

  // ===== BOTONES VOLVER Y CANCELAR =====
  // Botón volver (flecha)
  const btnVolver = document.querySelector('.btn-volver');
  if (btnVolver && p.libro_id) {
    btnVolver.href = 'vistaLibros.html?libro_id=' + p.libro_id;
  }

  // Botón cancelar
  const btnCancelar = document.querySelector('.btn-cancelar');
  if (btnCancelar) {
    btnCancelar.href = p.libro_id
      ? 'vistaLibros.html?libro_id=' + p.libro_id
      : 'vistaLibros.html';
  }

})();


// ===== FUNCIÓN PARA GUARDAR LOS CAMBIOS =====
function guardarEdicion(e) {
  // Evita que el formulario se recargue
  e.preventDefault();

  // Obtiene los valores del formulario
  const nombre   = document.getElementById('inputNombre').value.trim();
  const cedula   = document.getElementById('inputCedula').value.trim();
  const cargo    = document.getElementById('inputCargo').value.trim();
  const cajaId   = document.getElementById('selectCaja').value || null;
  const anioId   = document.getElementById('selectAnio').value || null;
  const posicion = document.getElementById('inputPosicion').value.trim();

  // Validación básica
  if (!nombre || !cedula) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'El nombre y la cédula son obligatorios.',
      confirmButtonColor: '#007ABF'
    });
    return;
  }

  try {
    // Actualiza el registro en la base de datos
    db.prepare(
      'UPDATE personal SET nombre=?, cedula=?, cargo=?, caja_id=?, anio_id=?, posicion=? WHERE id=?'
    ).run(
      nombre,
      cedula,
      cargo || null,
      cajaId,
      anioId,
      posicion || null,
      registroId
    );

    // Obtiene el libro asociado para redirigir correctamente
    const p = db.prepare('SELECT libro_id FROM personal WHERE id = ?').get(registroId);

    // Mensaje de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Guardado!',
      timer: 1400,
      showConfirmButton: false
    }).then(() => {

      // Redirige a la vista del libro correspondiente
      window.location.href = 'vistaLibros.html?libro_id=' + (p ? p.libro_id : '');
    });

  } catch (err) {

    // Error si la cédula ya existe (por restricción UNIQUE)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'La cédula ya existe en el sistema.',
      confirmButtonColor: '#007ABF'
    });
  }
}