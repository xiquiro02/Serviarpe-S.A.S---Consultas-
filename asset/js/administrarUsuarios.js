let filaEditando = null;
let contadorId = 4;

function abrirModalNuevo() {
  filaEditando = null;
  document.getElementById('modalTitulo').textContent = 'Nuevo usuario';
  document.getElementById('inputNombre').value = '';
  document.getElementById('inputCorreo').value = '';
  document.getElementById('inputRol').value = 'empleado';
  document.getElementById('btnGuardar').textContent = 'Guardar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function abrirModalEditar(btn) {
  filaEditando = btn.closest('tr');
  const celdas = filaEditando.querySelectorAll('td');
  const rolActual = filaEditando.querySelector('.rol-badge').dataset.rol;
  document.getElementById('modalTitulo').textContent = 'Editar usuario';
  document.getElementById('inputNombre').value = filaEditando.querySelector('.nombre-usuario').textContent.trim();
  document.getElementById('inputCorreo').value = celdas[2].textContent.trim();
  document.getElementById('inputRol').value = rolActual;
  document.getElementById('btnGuardar').textContent = 'Actualizar';
  document.getElementById('modalOverlay').classList.add('activo');
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('activo');
  filaEditando = null;
}

function guardarUsuario() {
  const nombre  = document.getElementById('inputNombre').value.trim();
  const correo  = document.getElementById('inputCorreo').value.trim();
  const rol     = document.getElementById('inputRol').value;

  if (!nombre || !correo) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Por favor completa el nombre y el correo del usuario.',
      confirmButtonColor: '#007ABF'
    });
    return;
  }

  if (!correo.includes('@')) {
    Swal.fire({
      icon: 'warning',
      title: 'Correo inválido',
      text: 'Por favor ingresa un correo electrónico válido.',
      confirmButtonColor: '#007ABF'
    });
    return;
  }

  const rolTexto  = rol === 'administrativo' ? 'Administrativo' : 'Empleado';
  const esEdicion = filaEditando !== null;

  if (filaEditando) {
    filaEditando.querySelector('.nombre-usuario').textContent = nombre;
    const celdas = filaEditando.querySelectorAll('td');
    celdas[2].textContent = correo;
    const badge = filaEditando.querySelector('.rol-badge');
    badge.dataset.rol = rol;
    badge.textContent = rolTexto;
    badge.className = `rol-badge rol-${rol}`;
  } else {
    const tbody = document.querySelector('#tablaUsuarios tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge">${contadorId}</span></td>
      <td>
        <div class="user-cell">
          <span class="avatar-icon">👤</span>
          <span class="nombre-usuario">${nombre}</span>
        </div>
      </td>
      <td>${correo}</td>
      <td><span class="rol-badge rol-${rol}" data-rol="${rol}">${rolTexto}</span></td>
      <td class="acciones-td">
        <button class="btn-editar"  title="Editar"       onclick="abrirModalEditar(this)">✏️</button>
        <button class="btn-rol"     title="Cambiar rol"  onclick="cambiarRol(this)">🔄</button>
        <button class="btn-eliminar" title="Eliminar"    onclick="confirmarEliminar(this)">🗑️</button>
      </td>`;
    tbody.appendChild(tr);
    contadorId++;
  }

  cerrarModal();
  Swal.fire({
    icon: 'success',
    title: esEdicion ? 'Usuario actualizado' : 'Usuario agregado',
    timer: 1400,
    showConfirmButton: false
  });
}

function cambiarRol(btn) {
  const fila      = btn.closest('tr');
  const nombre    = fila.querySelector('.nombre-usuario').textContent.trim();
  const badge     = fila.querySelector('.rol-badge');
  const rolActual = badge.dataset.rol;
  const nuevoRol  = rolActual === 'administrativo' ? 'empleado' : 'administrativo';
  const nuevoTexto = nuevoRol === 'administrativo' ? 'Administrativo' : 'Empleado';

  Swal.fire({
    title: `¿Cambiar rol de ${nombre}?`,
    html: `El nuevo rol será: <strong>${nuevoTexto}</strong>`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#007ABF',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, cambiar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      badge.dataset.rol  = nuevoRol;
      badge.textContent  = nuevoTexto;
      badge.className    = `rol-badge rol-${nuevoRol}`;
      Swal.fire({ icon: 'success', title: 'Rol actualizado', timer: 1400, showConfirmButton: false });
    }
  });
}

function confirmarEliminar(btn) {
  const nombre = btn.closest('tr').querySelector('.nombre-usuario').textContent.trim();
  Swal.fire({
    title: `¿Eliminar a ${nombre}?`,
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      btn.closest('tr').remove();
      Swal.fire({ icon: 'success', title: 'Usuario eliminado', timer: 1400, showConfirmButton: false });
    }
  });
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) cerrarModal();
});
