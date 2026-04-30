// ===== IMPORTACIÓN DE MÓDULOS =====
// Permite trabajar con rutas de archivos
const path = require('path');

// Conecta con la base de datos (archivo database.js en la raíz del proyecto)
const db = require(path.join(process.cwd(), 'database'));

// ===== VALIDACIÓN DE ACCESO (ROL ADMINISTRADOR) =====
// Función autoejecutable (se ejecuta apenas carga el archivo)
(function () {
  try {
    // Obtiene el usuario guardado en localStorage
    var u = JSON.parse(localStorage.getItem('usuario') || '{}');
    // Si el rol NO es administrador, redirige al menú principal
    if (u.rol !== 'administrador') {
      window.location.href = 'menuPrincipal.html';
    }

  } catch (e) {
    // Si ocurre algún error, también redirige
    window.location.href = 'menuPrincipal.html';
  }
})();


// ===== VARIABLE GLOBAL =====
// Guarda el ID de la caja que se está editando (null = modo crear)
let cajaEditandoId = null;

// ===== CARGAR DATOS EN LA TABLA =====
function cargarCajas() {

  // Consulta todas las cajas ordenadas por ID
  const cajas = db.prepare('SELECT * FROM cajas ORDER BY id').all();
  // Obtiene el cuerpo de la tabla
  const tbody = document.querySelector('#tablaCajas tbody');
  // Limpia la tabla antes de volver a llenarla
  tbody.innerHTML = '';

  // Recorre cada caja y crea una fila
  cajas.forEach(function (caja) {
    const tr = document.createElement('tr');
    // Guarda el ID en un atributo data
    tr.dataset.id = caja.id;
    // Inserta el contenido de la fila
    tr.innerHTML =
      '<td><span class="badge">' + caja.id + '</span></td>' +
      '<td>' + caja.numero + '</td>' +
      '<td>' + (caja.ubicacion || '') + '</td>' +
      '<td class="acciones-td">' +
        // Botón editar
        '<button class="btn-editar" title="Editar" onclick="abrirModalEditar(this)">✏️</button>' +
        // Botón eliminar
        '<button class="btn-eliminar" title="Eliminar" onclick="confirmarEliminar(this)">🗑️</button>' +
      '</td>';

    // Agrega la fila a la tabla
    tbody.appendChild(tr);
  });
}


// ===== MODAL: CREAR NUEVA CAJA =====
function abrirModalNuevo() {

  // Indica que no estamos editando
  cajaEditandoId = null;

  // Configura el modal
  document.getElementById('modalTitulo').textContent = 'Nueva caja';
  document.getElementById('inputNumero').value = '';
  document.getElementById('inputUbicacion').value = '';
  document.getElementById('btnGuardar').textContent = 'Guardar';

  // Muestra el modal
  document.getElementById('modalOverlay').classList.add('activo');
}


// ===== MODAL: EDITAR CAJA =====
function abrirModalEditar(btn) {

  // Obtiene la fila donde está el botón
  const fila = btn.closest('tr');
  // Guarda el ID de la caja a editar
  cajaEditandoId = parseInt(fila.dataset.id);
  // Obtiene las celdas de la fila
  const celdas = fila.querySelectorAll('td');

  // Llena el formulario con los datos actuales
  document.getElementById('modalTitulo').textContent = 'Editar caja';
  document.getElementById('inputNumero').value = celdas[1].textContent.trim();
  document.getElementById('inputUbicacion').value = celdas[2].textContent.trim();

  // Cambia el texto del botón
  document.getElementById('btnGuardar').textContent = 'Actualizar';

  // Muestra el modal
  document.getElementById('modalOverlay').classList.add('activo');
}


// ===== CERRAR MODAL =====
function cerrarModal() {
  // Oculta el modal
  document.getElementById('modalOverlay').classList.remove('activo');
  // Limpia el estado
  cajaEditandoId = null;
}


// ===== GUARDAR (INSERTAR O ACTUALIZAR) =====
function guardarCaja() {

  // Obtiene los valores del formulario
  const numero = document.getElementById('inputNumero').value.trim();
  const ubicacion = document.getElementById('inputUbicacion').value.trim();

  // Validación de campos
  if (!numero || !ubicacion) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Por favor completa el número y la ubicación de la caja.',
      confirmButtonColor: '#007ABF'
    });
    return;
  }

  // Verifica si es edición o creación
  const esEdicion = cajaEditandoId !== null;

  if (esEdicion) {
    // Actualiza registro existente
    db.prepare('UPDATE cajas SET numero = ?, ubicacion = ? WHERE id = ?')
      .run(numero, ubicacion, cajaEditandoId);
  } else {
    // Inserta nueva caja
    db.prepare('INSERT INTO cajas (numero, ubicacion) VALUES (?, ?)')
      .run(numero, ubicacion);
  }

  // Cierra modal y recarga tabla
  cerrarModal();
  cargarCajas();

  // Mensaje de éxito
  Swal.fire({
    icon: 'success',
    title: esEdicion ? 'Caja actualizada' : 'Caja agregada',
    timer: 1400,
    showConfirmButton: false
  });
}


// ===== ELIMINAR CAJA =====
function confirmarEliminar(btn) {

  // Obtiene la fila y el ID
  const fila = btn.closest('tr');
  const id = parseInt(fila.dataset.id);

  // Muestra confirmación
  Swal.fire({
    title: '¿Eliminar esta caja?',
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

      // Elimina de la base de datos
      db.prepare('DELETE FROM cajas WHERE id = ?').run(id);

      // Recarga la tabla
      cargarCajas();

      // Mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Caja eliminada',
        timer: 1400,
        showConfirmButton: false
      });
    }
  });
}

// ===== CERRAR MODAL HACIENDO CLICK FUERA =====
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  // Si se hace click fuera del contenido del modal
  if (e.target === this) {
    cerrarModal();
  }
});

// ===== INICIALIZACIÓN =====
// Carga los datos al iniciar la página
cargarCajas();