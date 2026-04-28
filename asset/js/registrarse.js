const { ipcRenderer } = require('electron');

function registrarse(e) {
  e.preventDefault();
  const nombre    = document.getElementById('inputNombre').value.trim();
  const usuario   = document.getElementById('inputUsuario').value.trim();
  const correo    = document.getElementById('inputCorreo').value.trim();
  const password  = document.getElementById('inputPassword').value;
  const confirmar = document.getElementById('inputConfirmar').value;

  if (!nombre || !usuario || !correo || !password || !confirmar) {
    Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa todos los campos.', confirmButtonColor: '#007ABF' });
    return;
  }
  if (!correo.includes('@')) {
    Swal.fire({ icon: 'warning', title: 'Correo inválido', text: 'Ingresa un correo electrónico válido.', confirmButtonColor: '#007ABF' });
    return;
  }
  if (password.length < 6) {
    Swal.fire({ icon: 'warning', title: 'Contraseña muy corta', text: 'La contraseña debe tener al menos 6 caracteres.', confirmButtonColor: '#007ABF' });
    return;
  }
  if (password !== confirmar) {
    Swal.fire({ icon: 'warning', title: 'No coinciden', text: 'Las contraseñas no coinciden.', confirmButtonColor: '#007ABF' });
    return;
  }

  ipcRenderer.send('registrar-usuario', { nombre, usuario, correo, password });
}

ipcRenderer.on('registro-respuesta', (event, respuesta) => {
  if (respuesta.exito) {
    Swal.fire({ icon: 'success', title: '¡Cuenta creada!', text: 'Ahora puedes iniciar sesión.', confirmButtonColor: '#007ABF' })
      .then(() => { window.location.href = '../index.html'; });
  } else {
    Swal.fire({ icon: 'error', title: 'Error al registrar', text: respuesta.mensaje, confirmButtonColor: '#007ABF' });
  }
});
