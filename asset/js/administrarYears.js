// Importa el módulo para manejar rutas
const path = require('path');
// Conecta con la base de datos desde la raíz del proyecto
const db = require(path.join(process.cwd(), 'database'));

/* ============================== VALIDACIÓN DE ACCESO (ADMIN) ============================== */
// Función autoejecutable para verificar el rol del usuario
(function () {
  try {
    // Obtiene el usuario guardado en localStorage
    var u = JSON.parse(localStorage.getItem('usuario') || '{}');
    // Si no es administrador, lo redirige al menú principal
    if (u.rol !== 'administrador') {
      window.location.href = 'menuPrincipal.html';
    }
  } catch (e) {
    // Si ocurre un error, también redirige
    window.location.href = 'menuPrincipal.html';
  }
})();

/* ============================== VARIABLE GLOBAL ============================== */
// Guarda el ID del año que se está editando
// null → significa que se está creando uno nuevo
let anioEditandoId = null;

/* ============================== CARGAR AÑOS EN LA INTERFAZ  ============================== */
function cargarAnios() {
  // Consulta todos los años ordenados por el valor del año
  const anios = db.prepare('SELECT * FROM anios ORDER BY anio').all();
  // Obtiene el contenedor (grid)
  const grid = document.getElementById('yearsGrid');

  // Limpia el contenido antes de renderizar
  grid.innerHTML = '';

  // Recorre cada año
  anios.forEach(function (anio) {
    // Crea un div por cada registro
    const div = document.createElement('div');
    div.className = 'year-item';
    // Guarda el ID como atributo data
    div.dataset.id = anio.id;

    // Construye el contenido HTML
    div.innerHTML =
      '<div class="year-izq">' +
        '<span class="year-icono">📅</span>' +
        '<span class="year-valor">' + anio.anio + '</span>' +
      '</div>' +
      '<div class="year-acciones">' +
        '<button class="btn-editar" title="Editar" onclick="abrirModalEditar(this)">✏️</button>' +
        '<button class="btn-eliminar" title="Eliminar" onclick="confirmarEliminar(this)">🗑️</button>' +
      '</div>';

    // Agrega el elemento al grid
    grid.appendChild(div);
  });
}

/* ============================== MODAL: NUEVO AÑO  ============================== */

function abrirModalNuevo() {
  // Indica que no se está editando
  anioEditandoId = null;

  // Configura el modal en modo creación
  document.getElementById('modalTitulo').textContent = 'Nuevo año';
  document.getElementById('inputYear').value = '';
  document.getElementById('btnGuardar').textContent = 'Guardar';

  // Muestra el modal
  document.getElementById('modalOverlay').classList.add('activo');
}

/* ============================== MODAL: EDITAR AÑO ============================== */

function abrirModalEditar(btn) {
  // Obtiene el elemento padre (year-item)
  const item = btn.closest('.year-item');

  // Guarda el ID del año
  anioEditandoId = parseInt(item.dataset.id);

  // Obtiene el valor del año desde el DOM
  const valor = item.querySelector('.year-valor').textContent;

  // Configura el modal en modo edición
  document.getElementById('modalTitulo').textContent = 'Editar año';
  document.getElementById('inputYear').value = valor;
  document.getElementById('btnGuardar').textContent = 'Actualizar';

  // Muestra el modal
  document.getElementById('modalOverlay').classList.add('activo');
}

/* ============================== CERRAR MODAL  ============================== */
function cerrarModal() {
  // Oculta el modal
  document.getElementById('modalOverlay').classList.remove('activo');
  // Limpia la variable de edición
  anioEditandoId = null;
}

/* ============================== GUARDAR AÑO (INSERT / UPDATE) ============================== */
function guardarYear() {
  // Obtiene el valor ingresado
  const valor = document.getElementById('inputYear').value.trim();

  // Validación: campo obligatorio
  if (!valor) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo requerido',
      text: 'Por favor ingresa un año válido.',
      confirmButtonColor: '#007ABF'
    });
    return;
  }

  // Determina si es edición o nuevo registro
  const esEdicion = anioEditandoId !== null;

  if (esEdicion) {
    // Actualiza el año existente
    db.prepare('UPDATE anios SET anio = ? WHERE id = ?')
      .run(valor, anioEditandoId);
  } else {
    // Inserta un nuevo año
    db.prepare('INSERT INTO anios (anio) VALUES (?)')
      .run(valor);
  }

  // Cierra el modal
  cerrarModal();
  // Recarga la lista
  cargarAnios();

  // Mensaje de éxito
  Swal.fire({
    icon: 'success',
    title: esEdicion ? 'Año actualizado' : 'Año agregado',
    timer: 1400,
    showConfirmButton: false
  });
}

/* ============================== ELIMINAR AÑO ============================== */
function confirmarEliminar(btn) {
  // Obtiene el elemento del año
  const item = btn.closest('.year-item');
  // Obtiene el ID
  const id = parseInt(item.dataset.id);

  // Muestra confirmación
  Swal.fire({
    title: '¿Eliminar este año?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {

      // Elimina el registro en la base de datos
      db.prepare('DELETE FROM anios WHERE id = ?').run(id);
      // Recarga la lista
      cargarAnios();

      // Mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Año eliminado',
        timer: 1400,
        showConfirmButton: false
      });
    }
  });
}

/* ============================== EVENTOS ============================== */
// Cierra el modal si se hace clic fuera de él
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) cerrarModal();
});

/* ============================== INICIO  ============================== */
// Carga los años al iniciar la página
cargarAnios();