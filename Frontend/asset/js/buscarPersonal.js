// Importa el módulo 'path' para manejar rutas de archivos
const path = require('path');
// Importa la base de datos desde el archivo 'database'
const db = require(path.join(process.cwd(), 'database'));

// Función para cargar todos los registros del personal desde la base de datos
function cargarPersonal() {

  // Consulta SQL:
  // - Trae todos los campos de la tabla 'personal' (p.*)
  // - Une (LEFT JOIN) con 'libros' para obtener el nombre del libro
  // - Une (LEFT JOIN) con 'cajas' para obtener número y ubicación
  // - Ordena los resultados por nombre del personal
  const registros = db.prepare(
    'SELECT p.*, l.nombre AS libro_nombre, c.numero AS caja_numero, c.ubicacion AS caja_ubicacion ' +
    'FROM personal p ' +
    'LEFT JOIN libros l ON p.libro_id = l.id ' +
    'LEFT JOIN cajas c  ON p.caja_id  = c.id ' +
    'ORDER BY p.nombre'
  ).all();

  // Selecciona el cuerpo (tbody) de la tabla en el HTML
  const tbody = document.querySelector('#tablaPersonal tbody');
  // Limpia la tabla antes de volver a cargar datos
  tbody.innerHTML = '';

  // Si no hay registros, muestra un mensaje en la tabla
  if (registros.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;padding:20px;">No hay registros de personal.</td></tr>';
    return;
  }

  // Recorre cada registro obtenido de la base de datos
  registros.forEach(function (p) {

    // Construye el texto de la posición:
    // - Si tiene libro, muestra "nombre del libro - posición"
    // - Si no tiene posición, solo muestra el libro
    // - Si no tiene libro, muestra un guion
    const posicion = p.libro_nombre
      ? p.libro_nombre + (p.posicion ? ' - ' + p.posicion : '')
      : '—';

    // Crea una nueva fila de la tabla
    const tr = document.createElement('tr');

    // Inserta el contenido HTML en la fila
    tr.innerHTML =
      // ID del personal
      '<td><span class="badge">' + p.id + '</span></td>' +

      // Nombre del personal
      '<td>' + p.nombre + '</td>' +

      // Número de caja (o guion si no tiene)
      '<td>' + (p.caja_numero  || '—') + '</td>' +

      // Ubicación de la caja (o guion si no tiene)
      '<td>' + (p.caja_ubicacion || '—') + '</td>' +

      // Posición (libro + posición)
      '<td>' + posicion + '</td>';

    // Agrega la fila al tbody
    tbody.appendChild(tr);
  });
}

// Función para filtrar la tabla según lo que el usuario escriba
function filtrarTabla() {

  // Obtiene el texto del input y lo convierte a minúsculas
  const input = document.getElementById('buscador').value.toLowerCase();

  // Recorre todas las filas de la tabla
  document.querySelectorAll('#tablaPersonal tbody tr').forEach(fila => {

    // Muestra la fila si contiene el texto buscado, si no la oculta
    fila.style.display = fila.textContent.toLowerCase().includes(input) ? '' : 'none';
  });
}

// Ejecuta la función al cargar la página para mostrar los datos
cargarPersonal();