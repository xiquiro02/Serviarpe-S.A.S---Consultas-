// Importa el módulo 'path' para manejar rutas de archivos
const path = require('path');
// Importa la base de datos desde el archivo 'database'
const db = require(path.join(process.cwd(), 'database'));
// Obtiene los parámetros de la URL (por ejemplo: ?libro_id=1)
const params  = new URLSearchParams(window.location.search);
// Convierte el parámetro 'libro_id' a número entero
const libroId = parseInt(params.get('libro_id'));


// ================================ INICIALIZACIÓN DEL FORMULARIO ================================
(function inicializarFormulario() {
  // Si existe un libroId en la URL
  if (libroId) {
    // Busca el libro en la base de datos
    const libro = db.prepare('SELECT * FROM libros WHERE id = ?').get(libroId);
    // Si el libro existe
    if (libro) {
      // Muestra el nombre del libro en el subtítulo del formulario
      const sub = document.getElementById('nuevo-subtitulo');
      if (sub) sub.textContent = libro.nombre;
    }
  }

  // ================================ CARGAR SELECT DE CAJAS  ================================
  const selectCaja = document.getElementById('selectCaja');

  // Consulta todas las cajas y las ordena por id
  db.prepare('SELECT * FROM cajas ORDER BY id').all().forEach(function (c) {
    // Crea una opción <option> para el select
    const opt = document.createElement('option');

    // El valor será el id de la caja
    opt.value = c.id;
    // Texto visible: número + ubicación (si existe)
    opt.textContent = c.numero + (c.ubicacion ? ' — ' + c.ubicacion : '');

    // Agrega la opción al select
    selectCaja.appendChild(opt);
  });

  // ================================ CARGAR SELECT DE AÑOS ================================
  const selectAnio = document.getElementById('selectAnio');

  // Consulta todos los años ordenados de mayor a menor
  db.prepare('SELECT * FROM anios ORDER BY anio DESC').all().forEach(function (a) {
    // Crea una opción <option>
    const opt = document.createElement('option');

    // El valor será el id del año
    opt.value = a.id;
    // Texto visible será el año (ej: 2024)
    opt.textContent = a.anio;

    // Agrega la opción al select
    selectAnio.appendChild(opt);
  });

})();


// ================================ FUNCIÓN PARA CREAR REGISTRO ================================
function crearRegistro(e) {

  // Evita que el formulario recargue la página
  e.preventDefault();

  // Obtiene los valores de los inputs
  const nombre   = document.getElementById('inputNombre').value.trim();
  const cedula   = document.getElementById('inputCedula').value.trim();
  const cargo    = document.getElementById('inputCargo').value.trim();
  const cajaId   = document.getElementById('selectCaja').value || null;
  const anioId   = document.getElementById('selectAnio').value || null;
  const posicion = document.getElementById('inputPosicion').value.trim();

  // ================================ VALIDACIÓN DE CAMPOS  ================================
  if (!nombre || !cedula) {

    // Muestra alerta si faltan campos obligatorios
    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'El nombre y la cédula son obligatorios.',
      confirmButtonColor: '#007ABF'
    });

    return;
  }

  // ================================ INSERTAR EN BASE DE DATOS ================================
  try {
    db.prepare(
      'INSERT INTO personal (nombre, cedula, cargo, libro_id, caja_id, anio_id, posicion) VALUES (?,?,?,?,?,?,?)'
    ).run(
      nombre,
      cedula,
      cargo || null,      // Si está vacío, guarda null
      libroId || null,    // Relación con el libro
      cajaId,
      anioId,
      posicion || null
    );

    // Muestra mensaje de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Registro creado!',
      timer: 1400,
      showConfirmButton: false
    })

    // Redirige al usuario al libro correspondiente
    .then(() => {
      window.location.href = 'vistaLibros.html?libro_id=' + libroId;
    });

  } catch (err) {

    // Error típico: cédula duplicada
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'La cédula ya existe en el sistema.',
      confirmButtonColor: '#007ABF'
    });
  }
}


// ================================ CONFIGURAR BOTÓN CANCELAR ================================
document.addEventListener("DOMContentLoaded", () => {

  // Obtiene nuevamente el libro_id desde la URL
  const params = new URLSearchParams(window.location.search);
  const libroId = params.get("libro_id"); 
  // Obtiene el botón cancelar
  const btnCancelar = document.getElementById("btnCancelar");

  // Si hay libro_id, vuelve a ese libro
  if (libroId) {
    btnCancelar.href = `vistaLibros.html?libro_id=${libroId}`;
  } else {
    // Si no, vuelve a la vista general
    btnCancelar.href = "vistaLibros.html";
  }
});