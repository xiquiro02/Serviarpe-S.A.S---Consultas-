const path   = require('path');
const db     = require(path.join(process.cwd(), 'database'));
const bcrypt = require('bcryptjs');

const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
const userId = usuarioGuardado.id;

(function cargarPerfil() {
  if (!userId) return;
  const u = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(userId);
  if (!u) return;
  document.getElementById('inputNombre').value = u.nombre;
  document.getElementById('inputEmail').value  = u.correo || '';
  const perfilNombre = document.querySelector('.perfil-nombre');
  if (perfilNombre) perfilNombre.textContent = u.nombre;
})();

// Vista previa de foto
document.getElementById('inputFoto').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { document.getElementById('fotoPreview').src = e.target.result; };
  reader.readAsDataURL(file);
});

function guardarDatos(e) {
  e.preventDefault();
  const nombre = document.getElementById('inputNombre').value.trim();
  const correo = document.getElementById('inputEmail').value.trim();
  if (!nombre) {
    Swal.fire({ icon: 'warning', title: 'Campo requerido', text: 'El nombre no puede estar vacío.', confirmButtonColor: '#F76927', confirmButtonText: 'Entendido' });
    return;
  }
  try {
    db.prepare('UPDATE usuarios SET nombre=?, correo=? WHERE id=?').run(nombre, correo, userId);
    const u = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(userId);
    localStorage.setItem('usuario', JSON.stringify(u));
    const perfilNombre = document.querySelector('.perfil-nombre');
    if (perfilNombre) perfilNombre.textContent = nombre;
    document.querySelectorAll('.user-nombre').forEach(el => { el.textContent = nombre; });
    Swal.fire({ icon: 'success', title: '¡Guardado!', text: 'Datos actualizados correctamente.', confirmButtonColor: '#27ae60', confirmButtonText: 'Aceptar' });
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el perfil.', confirmButtonColor: '#007ABF' });
  }
}

function cambiarContrasena(e) {
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

  const u = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(userId);
  if (!bcrypt.compareSync(actual, u.password)) {
    Swal.fire({ icon: 'error', title: 'Contraseña incorrecta', text: 'La contraseña actual no es correcta.', confirmButtonColor: '#F76927', confirmButtonText: 'Entendido' });
    return;
  }

  db.prepare('UPDATE usuarios SET password=? WHERE id=?').run(bcrypt.hashSync(nueva, 10), userId);
  Swal.fire({ icon: 'success', title: '¡Contraseña cambiada!', text: 'Tu contraseña fue actualizada correctamente.', confirmButtonColor: '#27ae60', confirmButtonText: 'Aceptar' });
  e.target.reset();
}

function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  const visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  btn.classList.toggle('visible', !visible);
}

function cerrarSesion() {
  Swal.fire({
    icon: 'warning',
    title: '¿Cerrar sesión?',
    text: 'Se cerrará la sesión actual del sistema.',
    showCancelButton: true,
    confirmButtonColor: '#ff0000',
    cancelButtonColor: '#24a818',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      localStorage.removeItem('usuario');
      window.location.href = '../index.html';
    }
  });
}
