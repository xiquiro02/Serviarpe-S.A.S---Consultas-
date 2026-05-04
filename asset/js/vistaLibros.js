// Se importa el módulo path para manejar rutas
const path = require('path');
// Se conecta a la base de datos local
const db = require(path.join(process.cwd(), 'database'));
// Se obtienen los parámetros de la URL (ej: ?libro_id=1)
const params  = new URLSearchParams(window.location.search);
// Se extrae el id del libro y se convierte a número
const libroId = parseInt(params.get('libro_id'));


// ================================ FUNCIÓN PRINCIPAL: CARGAR VISTA ================================
function cargarVista() {

  // Se obtiene el libro actual desde la BD (si existe)
  const libro = libroId 
    ? db.prepare('SELECT * FROM libros WHERE id = ?').get(libroId) 
    : null;


  // ================================ TÍTULO DINÁMICO ================================
  const titulo = document.getElementById('pagina-titulo');

  // Si existe el elemento, se cambia el texto según el libro
  if (titulo) {
    titulo.textContent = 'Registros - ' + 
      (libro ? libro.nombre.toUpperCase() : 'LIBRO');
  }


  // ================================ BOTÓN "NUEVO REGISTRO" ================================
  const btnNuevo = document.querySelector('a.btn-nuevo');

  // Se asigna el enlace con el libro correspondiente
  if (btnNuevo) {
    btnNuevo.href = 'nuevoRegistro.html?libro_id=' + libroId;
  }


  // ================================ CONSULTA DE REGISTROS ================================
  const registros = libroId
    ? db.prepare(
        // Consulta con JOIN para traer también el número de la caja
        'SELECT p.*, c.numero AS caja_numero FROM personal p ' +
        'LEFT JOIN cajas c ON p.caja_id = c.id ' +
        'WHERE p.libro_id = ? ORDER BY p.id'
      ).all(libroId)
    : [];


  // ================================ TABLA HTML ================================
  const tbody = document.querySelector('#tablaRegistros tbody');
  // Se limpia la tabla antes de cargar nuevos datos
  tbody.innerHTML = '';

  // ================================ MENSAJE SI NO HAY DATOS ================================
  if (registros.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align:center;color:#888;padding:20px;">' +
      'No hay registros en este libro.</td></tr>';
    return;
  }


  // ================================ RECORRER REGISTROS Y CREAR FILAS ================================
  registros.forEach(function (p) {

    const tr = document.createElement('tr');

    // Se construye cada fila de la tabla dinámicamente
    tr.innerHTML =
      // ID con badge
      '<td><span class="badge azul">' + p.id + '</span></td>' +

      // Nombre
      '<td>' + p.nombre + '</td>' +

      // Cédula
      '<td>' + p.cedula + '</td>' +

      // Cargo (si no existe muestra —)
      '<td>' + (p.cargo || '—') + '</td>' +

      // Posición (si no existe muestra —)
      '<td>' + (p.posicion || '—') + '</td>' +

      // Acciones (editar y eliminar)
      '<td>' +
        '<a href="editar.html?id=' + p.id + '" class="btn-editar">✏️ Editar</a>' +
        ' <button class="btn-eliminar" style="font-size:.8rem;padding:4px 8px;" onclick="eliminarRegistro(' + p.id + ')">🗑️</button>' +
      '</td>';

    // Se agrega la fila al tbody
    tbody.appendChild(tr);
  });
}


// ================================ ELIMINAR REGISTRO ================================
function eliminarRegistro(id) {

  // Se muestra una alerta de confirmación con SweetAlert
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

    // Si el usuario confirma
    if (result.isConfirmed) {

      // Se elimina el registro de la BD
      db.prepare('DELETE FROM personal WHERE id = ?').run(id);

      // Se recarga la vista
      cargarVista();

      // Mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Registro eliminado',
        timer: 1400,
        showConfirmButton: false
      });
    }
  });
}


// ================================ FILTRO DE BÚSQUEDA EN TABLA ================================
function filtrarTabla() {

  // Se obtiene el texto ingresado en el buscador
  const input = document.getElementById('buscador').value.toLowerCase();
  // Se recorren todas las filas de la tabla
  document.querySelectorAll('#tablaRegistros tbody tr').forEach(fila => {

    // Se muestra u oculta según si coincide con el texto
    fila.style.display =
      fila.textContent.toLowerCase().includes(input) ? '' : 'none';
  });
}


// ================================ INICIO ================================
// Se ejecuta la carga inicial de la vista
cargarVista();