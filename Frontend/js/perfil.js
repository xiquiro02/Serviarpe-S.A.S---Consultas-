const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
const userId = usuarioGuardado.id;

(async function cargarPerfil() {
  if (!userId) return;
  const { ok, data: u } = await getUsuarioById(userId);
  if (!ok || !u) return;
  document.getElementById('inputNombre').value = u.nombre;
  document.getElementById('inputEmail').value  = u.correo || '';
  const perfilNombre = document.querySelector('.perfil-nombre');
  if (perfilNombre) perfilNombre.textContent = u.nombre;
})();


document.getElementById('inputFoto').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { document.getElementById('fotoPreview').src = e.target.result; };
  reader.readAsDataURL(file);
});


async function guardarDatos(e) {
  e.preventDefault();
  const nombre = document.getElementById('inputNombre').value.trim();
  const correo = document.getElementById('inputEmail').value.trim();

  if (!nombre) {
    Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'El nombre no puede estar vacío.', confirmButtonColor: '#F76927', confirmButtonText: 'Entendido' });
    return;
  }

  const { ok, data } = await updateUsuario(userId, nombre, correo);
  if (!ok) {
    Swal.fire({ icon: 'error', title: 'Error', text: data.mensaje, confirmButtonColor: '#007ABF' });
    return;
  }

  localStorage.setItem('usuario', JSON.stringify({ ...usuarioGuardado, nombre, correo }));
  const perfilNombre = document.querySelector('.perfil-nombre');
  if (perfilNombre) perfilNombre.textContent = nombre;
  document.querySelectorAll('.user-nombre').forEach(el => { el.textContent = nombre; });
  Swal.fire({ icon: 'success', title: '¡Guardado!', text: 'Datos actualizados correctamente.', confirmButtonColor: '#27ae60', confirmButtonText: 'Aceptar' });
}


async function cambiarContrasena(e) {
  e.preventDefault();
  const actual    = document.getElementById('inputPassActual').value;
  const nueva     = document.getElementById('inputPassNueva').value;
  const confirmar = document.getElementById('inputPassConfirmar').value;

  if (!actual || !nueva || !confirmar) {
    Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa todos los campos.', confirmButtonColor: '#F76927', confirmButtonText: 'Entendido' });
    return;
  }
  if (nueva.length < 6) {
    Swal.fire({ icon: 'error', title: 'Contraseña muy corta', text: 'La nueva contraseña debe tener al menos 6 caracteres.', confirmButtonColor: '#F76927', confirmButtonText: 'Entendido' });
    return;
  }
  if (nueva !== confirmar) {
    Swal.fire({ icon: 'error', title: 'No coinciden', text: 'La nueva contraseña y la confirmación no coinciden.', confirmButtonColor: '#F76927', confirmButtonText: 'Entendido' });
    return;
  }

  const { ok, data } = await updatePasswordUsuario(userId, actual, nueva);
  if (ok) {
    Swal.fire({ icon: 'success', title: '¡Contraseña cambiada!', text: 'Tu contraseña fue actualizada correctamente.', confirmButtonColor: '#27ae60', confirmButtonText: 'Aceptar' });
    e.target.reset();
  } else {
    Swal.fire({ icon: 'error', title: 'Error', text: data.mensaje, confirmButtonColor: '#F76927', confirmButtonText: 'Entendido' });
  }
}


function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  input.type  = input.type === 'text' ? 'password' : 'text';
  btn.classList.toggle('visible', input.type === 'text');
}


function cerrarSesion() {
  Swal.fire({
    icon: 'warning', title: '¿Cerrar sesión?', text: 'Se cerrará la sesión actual del sistema.',
    showCancelButton: true, confirmButtonColor: '#ff0000', cancelButtonColor: '#24a818',
    confirmButtonText: 'Sí, cerrar sesión', cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '../index.html';
    }
  });
}
