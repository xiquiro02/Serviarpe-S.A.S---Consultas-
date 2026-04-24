// Sidebar
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const btnMenu = document.getElementById('btnMenu');

function toggleMenu() {
  const abierto = sidebar.classList.toggle('abierto');
  overlay.classList.toggle('activo', abierto);
  btnMenu.classList.toggle('activo', abierto);
}

function cerrarMenu() {
  sidebar.classList.remove('abierto');
  overlay.classList.remove('activo');
  btnMenu.classList.remove('activo');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarMenu();
});

// Cambiar foto — previsualización instantánea
document.getElementById('inputFoto').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('fotoPreview').src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// Guardar datos personales
function guardarDatos(e) {
  e.preventDefault();
  const nombre = document.getElementById('inputNombre').value.trim();
  if (!nombre) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo requerido',
      text: 'El nombre no puede estar vacío.',
      confirmButtonColor: '#F76927',
      confirmButtonText: 'Entendido'
    });
    return;
  }
  Swal.fire({
    icon: 'success',
    title: '¡Guardado!',
    text: 'Datos personales actualizados correctamente.',
    confirmButtonColor: '#27ae60',
    confirmButtonText: 'Aceptar'
  });
}

// Cambiar contraseña
function cambiarContrasena(e) {
  e.preventDefault();
  const actual    = document.getElementById('inputPassActual').value;
  const nueva     = document.getElementById('inputPassNueva').value;
  const confirmar = document.getElementById('inputPassConfirmar').value;

  if (!actual || !nueva || !confirmar) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos.',
      confirmButtonColor: '#F76927',
      confirmButtonText: 'Entendido'
    });
    return;
  }
  if (nueva.length < 6) {
    Swal.fire({
      icon: 'error',
      title: 'Contraseña muy corta',
      text: 'La nueva contraseña debe tener al menos 6 caracteres.',
      confirmButtonColor: '#F76927',
      confirmButtonText: 'Entendido'
    });
    return;
  }
  if (nueva !== confirmar) {
    Swal.fire({
      icon: 'error',
      title: 'No coinciden',
      text: 'La nueva contraseña y la confirmación no coinciden.',
      confirmButtonColor: '#F76927',
      confirmButtonText: 'Entendido'
    });
    return;
  }
  Swal.fire({
    icon: 'success',
    title: '¡Contraseña cambiada!',
    text: 'Tu contraseña fue actualizada correctamente.',
    confirmButtonColor: '#27ae60',
    confirmButtonText: 'Aceptar'
  });
  e.target.reset();
}

// Mostrar / ocultar contraseña
function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  const visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  btn.classList.toggle('visible', !visible);
}

// Cerrar sesión
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
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = '../index.html';
    }
  });
}
