// Importa el módulo 'path' para manejar rutas de archivos
const path = require('path');
// Importa la base de datos desde el archivo 'database'
const db = require(path.join(process.cwd(), 'database'));
// Array con los nombres de imágenes que se usarán para los libros
const IMAGENES_LIBROS = ['libro_azul.png', 'libro_verde.png', 'libro_naranja.png'];


// Función principal que carga toda la información del dashboard
function cargarDashboard() {
  // ===== TOTAL DE CARPETAS =====
  // Cuenta cuántos registros hay en la tabla 'personal'
  const totalCarpetas = db.prepare('SELECT COUNT(*) as total FROM personal').get();

  // Muestra el total en el elemento HTML
  document.getElementById('numCarpetas').textContent = totalCarpetas.total;

  // ===== TOTAL DE CAJAS =====
  // Cuenta cuántas cajas hay registradas
  const totalCajas = db.prepare('SELECT COUNT(*) as total FROM cajas').get();

  // Muestra el total en el HTML
  document.getElementById('numCajas').textContent = totalCajas.total;

  // ===== RANGO DE AÑOS =====
  // Obtiene el año mínimo y máximo registrados
  const rangoAnios = db.prepare('SELECT MIN(anio) as min, MAX(anio) as max FROM anios').get();

  const spanAnios = document.getElementById('rangoAnios');

  // Si existen datos de años
  if (rangoAnios.min && rangoAnios.max) {

    // Si solo hay un año, muestra uno solo
    // Si hay varios, muestra el rango (ej: 2020 – 2025)
    spanAnios.textContent = rangoAnios.min === rangoAnios.max
      ? rangoAnios.min
      : rangoAnios.min + ' – ' + rangoAnios.max;

  } else {

    // Si no hay años registrados
    spanAnios.textContent = '—';
  }


  // ===== GRID DE LIBROS =====
  // Obtiene todos los libros de la base de datos
  const libros = db.prepare('SELECT * FROM libros ORDER BY id').all();
  const grid = document.getElementById('librosGrid');

  // Limpia el contenido anterior
  grid.innerHTML = '';

  // Si no hay libros registrados
  if (libros.length === 0) {
    // Muestra mensaje en el grid
    grid.innerHTML = '<p style="color:#888;grid-column:1/-1;text-align:center;">No hay libros registrados.</p>';

  } else {

    // Recorre cada libro
    libros.forEach(function (libro, i) {

      // Selecciona una imagen de forma cíclica
      const img = IMAGENES_LIBROS[i % IMAGENES_LIBROS.length];

      // Crea un enlace (<a>) para cada libro
      const a = document.createElement('a');

      // Redirige a la vista del libro con su ID
      a.href = 'vistaLibros.html?libro_id=' + libro.id;

      a.className = 'link-libros';

      // Contenido interno (card del libro)
      a.innerHTML =
        '<div class="libro-card">' +

          // Imagen del libro
          '<img src="../asset/imagenes/' + img + '" alt="' + libro.nombre + '" class="libro-img" />' +

          // Nombre del libro la primera letra en mayúscula y lo demas en minúscula
          '<span class="libro-titulo">' + (libro.nombre.charAt(0).toUpperCase() + libro.nombre.slice(1).toLowerCase()) + '</span>' +

        '</div>';

      // Agrega el elemento al grid
      grid.appendChild(a);
    });
  }
}

// Ejecuta la función al cargar la página
cargarDashboard();