const path = require('path');
const db = require(path.join(process.cwd(), 'database'));
const bcrypt = require('bcryptjs');
let usuarioEditandoId = null;

function cargarUsuarios() {
  const usuarios = db.prepare('SELECT * FROM usuarios ORDER BY id').all();
  const tbody = document.querySelector('#tablaUsuarios tbody');
  tbody.innerHTML = '';
  usuarios.forEach(function (u) {
    const rolTexto = u.rol === 'administrador' ? 'Administrativo' : 'Empleado';
    const rolClass = u.rol === 'administrador' ? 'rol-administrativo' : 'rol-empleado';
    const tr = document.createElement('tr');
    tr.dataset.id = u.id;
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
    tbody.appendChild(tr);
  });
}

function abrirModalNuevo() {
  usuarioEditandoId = null;
  document.getElementById('modalTitulo').textContent = 'Nuevo usuario';
  document.getElementById('inputNombre').value = '';
  document.getElementById('inputUsuario').value = '';
  document.getElementById('inputCorreo').value = '';
  document.getElementById('inputRol').value = 'empleado';
  document.getElementById('inputPassword').value = '';
  document.getElementById('grupoPassword').style.display = '';
  document.getElementById('btnGuardar').textContent = 'Guardar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function abrirModalEditar(btn) {
  const fila = btn.closest('tr');
  usuarioEditandoId = parseInt(fila.dataset.id);
  const u = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(usuarioEditandoId);
  document.getElementById('modalTitulo').textContent = 'Editar usuario';
  document.getElementById('inputNombre').value = u.nombre;
  document.getElementById('inputUsuario').value = u.usuario;
  document.getElementById('inputCorreo').value = u.correo;
  document.getElementById('inputRol').value = u.rol;
  document.getElementById('inputPassword').value = '';
  document.getElementById('grupoPassword').style.display = 'none';
  document.getElementById('btnGuardar').textContent = 'Actualizar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('activo');
  usuarioEditandoId = null;
}

function guardarUsuario() {
  const nombre  = document.getElementById('inputNombre').value.trim();
  const usuario = document.getElementById('inputUsuario').value.trim();
  const correo  = document.getElementById('inputCorreo').value.trim();
  const rol     = document.getElementById('inputRol').value;
  const pass    = document.getElementById('inputPassword').value.trim();

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
      if (pass) {
        const hash = bcrypt.hashSync(pass, 10);
        db.prepare('UPDATE usuarios SET nombre=?, usuario=?, correo=?, rol=?, password=? WHERE id=?')
          .run(nombre, usuario, correo, rol, hash, usuarioEditandoId);
      } else {
        db.prepare('UPDATE usuarios SET nombre=?, usuario=?, correo=?, rol=? WHERE id=?')
          .run(nombre, usuario, correo, rol, usuarioEditandoId);
      }
    } else {
      if (!pass) {
        Swal.fire({ icon: 'warning', title: 'Contraseña requerida', text: 'Ingresa una contraseña para el nuevo usuario.', confirmButtonColor: '#007ABF' });
        return;
      }
      const hash = bcrypt.hashSync(pass, 10);
      db.prepare('INSERT INTO usuarios (nombre, usuario, correo, password, rol) VALUES (?,?,?,?,?)')
        .run(nombre, usuario, correo, hash, rol);
    }
    cerrarModal();
    cargarUsuarios();
    Swal.fire({ icon: 'success', title: esEdicion ? 'Usuario actualizado' : 'Usuario agregado', timer: 1400, showConfirmButton: false });
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'El usuario o correo ya existe en el sistema.', confirmButtonColor: '#007ABF' });
  }
}

function cambiarRol(btn) {
  const fila      = btn.closest('tr');
  const id        = parseInt(fila.dataset.id);
  const nombre    = fila.querySelector('.nombre-usuario').textContent.trim();
  const badge     = fila.querySelector('.rol-badge');
  const rolActual = badge.dataset.rol;
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
      db.prepare('UPDATE usuarios SET rol = ? WHERE id = ?').run(nuevoRol, id);
      badge.dataset.rol = nuevoRol;
      badge.textContent = nuevoTexto;
      badge.className = 'rol-badge ' + (nuevoRol === 'administrador' ? 'rol-administrativo' : 'rol-empleado');
      Swal.fire({ icon: 'success', title: 'Rol actualizado', timer: 1400, showConfirmButton: false });
    }
  });
}

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
      db.prepare('DELETE FROM usuarios WHERE id = ?').run(id);
      cargarUsuarios();
      Swal.fire({ icon: 'success', title: 'Usuario eliminado', timer: 1400, showConfirmButton: false });
    }
  });
}

document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) cerrarModal();
});

cargarUsuarios();
