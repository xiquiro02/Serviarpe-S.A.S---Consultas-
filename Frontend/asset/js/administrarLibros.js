// Importa el módulo path de Node.js para manejar rutas de archivos
const path = require('path');
// Importa la base de datos desde la ruta raíz del proyecto
const db = require(path.join(process.cwd(), 'database'));
// Array de iconos que se asignarán a cada libro (de forma rotativa)
const iconos = ['📘', '📗', '📙', '📕', '📓', '📒', '📔'];

/* ============================== VALIDACIÓN DE USUARIO ADMIN ============================== */
// Función autoejecutable para verificar si el usuario es administrador
(function () {
  try {
    // Obtiene el usuario guardado en localStorage
    var u = JSON.parse(localStorage.getItem('usuario') || '{}');

    // Si no es administrador, lo redirige al menú principal
    if (u.rol !== 'administrador') {
      window.location.href = 'menuPrincipal.html';
    }
  } catch (e) {
    // Si ocurre algún error, también redirige
    window.location.href = 'menuPrincipal.html';
  }
})();

/* ============================== VARIABLES GLOBALES ============================== */
// Guarda el ID del libro que se está editando
// Si es null → significa que se está creando uno nuevo
let libroEditandoId = null;

/* ============================== CARGAR LIBROS EN LA INTERFAZ ============================== */
function cargarLibros() {
  // Consulta todos los libros ordenados por ID
  const libros = db.prepare('SELECT * FROM libros ORDER BY id').all();
  // Obtiene el elemento UL donde se mostrarán
  const lista = document.getElementById('listaLibros');
  // Limpia la lista antes de volver a renderizar
  lista.innerHTML = '';
  // Recorre todos los libros
  libros.forEach(function (libro, i) {

    // Asigna un icono dependiendo de la posición
    const icono = iconos[i % iconos.length];

    // Crea un elemento <li>
    const li = document.createElement('li');
    li.className = 'lista-item';

    // Guarda el ID en un atributo data
    li.dataset.id = libro.id;

    // Construye el contenido HTML del item
    li.innerHTML =
      '<div class="item-izq">' +
        '<span class="item-icono">' + icono + '</span>' +
        '<span class="item-nombre">' + libro.nombre + '</span>' +
      '</div>' +
      '<div class="item-acciones">' +
        '<button class="btn-editar" title="Editar" onclick="abrirModalEditar(this)">✏️</button>' +
        '<button class="btn-eliminar" title="Eliminar" onclick="confirmarEliminar(this)">🗑️</button>' +
      '</div>';

    // Agrega el item a la lista
    lista.appendChild(li);
  });
}

/* ============================== MODAL: NUEVO LIBRO  ============================== */
function abrirModalNuevo() {
  // Indica que no se está editando nada
  libroEditandoId = null;

  // Cambia el título del modal
  document.getElementById('modalTitulo').textContent = 'Nuevo libro';
  // Limpia el input
  document.getElementById('inputNombreLibro').value = '';
  // Cambia el texto del botón
  document.getElementById('btnGuardar').textContent = 'Guardar';
  // Muestra el modal
  document.getElementById('modalOverlay').classList.add('activo');
}

/* ============================== MODAL: EDITAR LIBRO ============================== */
function abrirModalEditar(btn) {
  // Obtiene el item padre del botón
  const item = btn.closest('.lista-item');
  // Guarda el ID del libro que se va a editar
  libroEditandoId = parseInt(item.dataset.id);
  // Obtiene el nombre actual del libro
  const nombre = item.querySelector('.item-nombre').textContent;

  // Configura el modal en modo edición
  document.getElementById('modalTitulo').textContent = 'Editar libro';
  document.getElementById('inputNombreLibro').value = nombre;
  document.getElementById('btnGuardar').textContent = 'Actualizar';

  // Muestra el modal
  document.getElementById('modalOverlay').classList.add('activo');
}

/* ============================== CERRAR MODAL  ============================== */
function cerrarModal() {
  // Oculta el modal
  document.getElementById('modalOverlay').classList.remove('activo');

  // Limpia la variable de edición
  libroEditandoId = null;
}

/* ============================== GUARDAR LIBRO (INSERT / UPDATE) ============================== */
function guardarLibro() {
  // Obtiene el valor del input
  const nombre = document.getElementById('inputNombreLibro').value.trim();

  // Validación: campo obligatorio
  if (!nombre) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo requerido',
      text: 'Por favor ingresa el nombre del libro.',
      confirmButtonColor: '#007ABF'
    });
    return;
  }

  // Verifica si es edición o creación
  const esEdicion = libroEditandoId !== null;

  if (esEdicion) {
    // Actualiza el libro existente
    db.prepare('UPDATE libros SET nombre = ? WHERE id = ?')
      .run(nombre, libroEditandoId);
  } else {
    // Inserta un nuevo libro
    db.prepare('INSERT INTO libros (nombre) VALUES (?)')
      .run(nombre);
  }

  // Cierra el modal
  cerrarModal();
  // Recarga la lista
  cargarLibros();

  // Mensaje de éxito
  Swal.fire({
    icon: 'success',
    title: esEdicion ? 'Libro actualizado' : 'Libro agregado',
    timer: 1400,
    showConfirmButton: false
  });
}

/* ============================== ELIMINAR LIBRO  ============================== */
function confirmarEliminar(btn) {
  // Obtiene el item del libro
  const item = btn.closest('.lista-item');
  // Obtiene el ID
  const id = parseInt(item.dataset.id);

  // Muestra confirmación
  Swal.fire({
    title: '¿Eliminar este libro?',
    text: 'Se eliminarán también los registros de personal asociados.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {

      // Elimina primero los registros relacionados (tabla personal)
      db.prepare('DELETE FROM personal WHERE libro_id = ?').run(id);

      // Luego elimina el libro
      db.prepare('DELETE FROM libros WHERE id = ?').run(id);

      // Recarga la lista
      cargarLibros();

      // Mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Libro eliminado',
        timer: 1400,
        showConfirmButton: false
      });
    }
  });
}

/* ============================== EVENTOS============================== */
// Cierra el modal si se hace clic fuera de él
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) cerrarModal();
});

/* ============================== INICIALIZACIÓN ============================== */
// Carga los libros al iniciar la página
cargarLibros();