// Importa el módulo para manejar rutas de archivos
const path = require('path');
// Conecta con la base de datos ubicada en la raíz del proyecto
const db = require(path.join(process.cwd(), 'database'));
// Librería para encriptar contraseñas
const bcrypt = require('bcryptjs');

/* ==============================VALIDACIÓN DE ACCESO (ADMIN) ============================== */
// Función autoejecutable para verificar si el usuario es administrador
(function () {
  try {
    // Obtiene el usuario desde localStorage
    var u = JSON.parse(localStorage.getItem('usuario') || '{}');

    // Si no es administrador → lo redirige
    if (u.rol !== 'administrador') {
      window.location.href = 'menuPrincipal.html';
    }
  } catch (e) {
    // Si hay error → también redirige
    window.location.href = 'menuPrincipal.html';
  }
})();

/* ============================== VARIABLE GLOBAL  ============================== */
// Guarda el ID del usuario en edición
// null = se está creando un usuario nuevo
let usuarioEditandoId = null;

/* ============================== CARGAR USUARIOS EN TABLA ============================== */
function cargarUsuarios() {
  // Consulta todos los usuarios
  const usuarios = db.prepare('SELECT * FROM usuarios ORDER BY id').all();
  // Obtiene el tbody de la tabla
  const tbody = document.querySelector('#tablaUsuarios tbody');
  // Limpia la tabla
  tbody.innerHTML = '';

  // Recorre cada usuario
  usuarios.forEach(function (u) {

    // Define el texto del rol
    const rolTexto = u.rol === 'administrador' ? 'Administrativo' : 'Empleado';
    // Define la clase CSS según el rol
    const rolClass = u.rol === 'administrador' ? 'rol-administrativo' : 'rol-empleado';
    // Crea una fila
    const tr = document.createElement('tr');
    // Guarda el ID en el atributo data
    tr.dataset.id = u.id;

    // Construye la fila
    tr.innerHTML =
      '<td><span class="badge">' + u.id + '</span></td>' +
      '<td><div class="user-cell">' +
        '<span class="avatar-icon">👤</span>' +
        '<span class="nombre-usuario">' + u.nombre + '</span>' +
      '</div></td>' +
      '<td>' + u.correo + '</td>' +
      '<td><span class="rol-badge ' + rolClass + '" data-rol="' + u.rol + '">' + rolTexto + '</span></td>' +
      '<td class="acciones-td">' +
        '<button class="btn-editar"   title="Editar"      onclick="abrirModalEditar(this)">✏️</button>' +
        '<button class="btn-rol"      title="Cambiar rol" onclick="cambiarRol(this)">🔄</button>' +
        '<button class="btn-eliminar" title="Eliminar"    onclick="confirmarEliminar(this)">🗑️</button>' +
      '</td>';

    // Agrega la fila a la tabla
    tbody.appendChild(tr);
  });
}

/* ============================== MODAL: NUEVO USUARIO ============================== */

function abrirModalNuevo() {
  usuarioEditandoId = null;

  // Configura el modal para creación
  document.getElementById('modalTitulo').textContent = 'Nuevo usuario';
  document.getElementById('inputNombre').value = '';
  document.getElementById('inputUsuario').value = '';
  document.getElementById('inputCorreo').value = '';
  document.getElementById('inputRol').value = 'empleado';
  document.getElementById('inputPassword').value = '';

  // Muestra el campo contraseña
  document.getElementById('grupoPassword').style.display = '';
  document.getElementById('btnGuardar').textContent = 'Guardar';

  // Abre el modal
  document.getElementById('modalOverlay').classList.add('activo');
}

/* ============================== MODAL: EDITAR USUARIO  ============================== */

function abrirModalEditar(btn) {
  const fila = btn.closest('tr');

  // Guarda el ID del usuario
  usuarioEditandoId = parseInt(fila.dataset.id);
  // Consulta el usuario en la BD
  const u = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(usuarioEditandoId);

  // Llena el formulario con los datos
  document.getElementById('modalTitulo').textContent = 'Editar usuario';
  document.getElementById('inputNombre').value = u.nombre;
  document.getElementById('inputUsuario').value = u.usuario;
  document.getElementById('inputCorreo').value = u.correo;
  document.getElementById('inputRol').value = u.rol;

  // Limpia contraseña y oculta el campo
  document.getElementById('inputPassword').value = '';
  document.getElementById('grupoPassword').style.display = 'none';

  document.getElementById('btnGuardar').textContent = 'Actualizar';

  document.getElementById('modalOverlay').classList.add('activo');
}

/* ============================== CERRAR MODAL ============================== */
function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('activo');
  usuarioEditandoId = null;
}

/* ============================== GUARDAR USUARIO (INSERT / UPDATE)  ============================== */
function guardarUsuario() {
  // Obtiene valores del formulario
  const nombre  = document.getElementById('inputNombre').value.trim();
  const usuario = document.getElementById('inputUsuario').value.trim();
  const correo  = document.getElementById('inputCorreo').value.trim();
  const rol     = document.getElementById('inputRol').value;
  const pass    = document.getElementById('inputPassword').value.trim();

  // Validaciones básicas
  if (!nombre || !usuario || !correo) {
    Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Por favor completa nombre, usuario y correo.', confirmButtonColor: '#007ABF' });
    return;
  }

  if (!correo.includes('@')) {
    Swal.fire({ icon: 'warning', title: 'Correo inválido', text: 'Ingresa un correo electrónico válido.', confirmButtonColor: '#007ABF' });
    return;
  }

  const esEdicion = usuarioEditandoId !== null;

  try {
    if (esEdicion) {
      // Si está editando
      if (pass) {
        // Si escribió nueva contraseña → se encripta
        const hash = bcrypt.hashSync(pass, 10);

        db.prepare('UPDATE usuarios SET nombre=?, usuario=?, correo=?, rol=?, password=? WHERE id=?')
          .run(nombre, usuario, correo, rol, hash, usuarioEditandoId);
      } else {
        // Si no cambia contraseña
        db.prepare('UPDATE usuarios SET nombre=?, usuario=?, correo=?, rol=? WHERE id=?')
          .run(nombre, usuario, correo, rol, usuarioEditandoId);
      }
    } else {
      // Nuevo usuario
      if (!pass) {
        Swal.fire({ icon: 'warning', title: 'Contraseña requerida', text: 'Ingresa una contraseña para el nuevo usuario.', confirmButtonColor: '#007ABF' });
        return;
      }

      // Encripta la contraseña
      const hash = bcrypt.hashSync(pass, 10);

      db.prepare('INSERT INTO usuarios (nombre, usuario, correo, password, rol) VALUES (?,?,?,?,?)')
        .run(nombre, usuario, correo, hash, rol);
    }

    cerrarModal();
    cargarUsuarios();

    Swal.fire({
      icon: 'success',
      title: esEdicion ? 'Usuario actualizado' : 'Usuario agregado',
      timer: 1400,
      showConfirmButton: false
    });

  } catch (e) {
    // Error común: duplicado
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El usuario o correo ya existe en el sistema.',
      confirmButtonColor: '#007ABF'
    });
  }
}

/* ============================== CAMBIAR ROL  ============================== */
function cambiarRol(btn) {
  const fila      = btn.closest('tr');
  const id        = parseInt(fila.dataset.id);
  const nombre    = fila.querySelector('.nombre-usuario').textContent.trim();
  const badge     = fila.querySelector('.rol-badge');

  // Rol actual
  const rolActual = badge.dataset.rol;

  // Alterna rol
  const nuevoRol  = rolActual === 'administrador' ? 'empleado' : 'administrador';
  const nuevoTexto = nuevoRol === 'administrador' ? 'Administrativo' : 'Empleado';

  Swal.fire({
    title: '¿Cambiar rol de ' + nombre + '?',
    html: 'El nuevo rol será: <strong>' + nuevoTexto + '</strong>',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#007ABF',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, cambiar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {

      // Actualiza en la BD
      db.prepare('UPDATE usuarios SET rol = ? WHERE id = ?').run(nuevoRol, id);

      // Actualiza visualmente sin recargar
      badge.dataset.rol = nuevoRol;
      badge.textContent = nuevoTexto;
      badge.className = 'rol-badge ' + (nuevoRol === 'administrador' ? 'rol-administrativo' : 'rol-empleado');

      Swal.fire({ icon: 'success', title: 'Rol actualizado', timer: 1400, showConfirmButton: false });
    }
  });
}

/* ============================== ELIMINAR USUARIO ============================== */
function confirmarEliminar(btn) {
  const fila   = btn.closest('tr');
  const id     = parseInt(fila.dataset.id);
  const nombre = fila.querySelector('.nombre-usuario').textContent.trim();

  Swal.fire({
    title: '¿Eliminar a ' + nombre + '?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {

      // Elimina el usuario
      db.prepare('DELETE FROM usuarios WHERE id = ?').run(id);

      cargarUsuarios();

      Swal.fire({ icon: 'success', title: 'Usuario eliminado', timer: 1400, showConfirmButton: false });
    }
  });
}

/* ============================== EVENTOS  ============================== */
// Cierra modal al hacer clic fuera
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) cerrarModal();
});

/* ============================== INICIO ============================== */
// Carga los usuarios al iniciar
cargarUsuarios();