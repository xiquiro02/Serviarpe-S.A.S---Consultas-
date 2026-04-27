const { ipcRenderer } = require('electron');

function registrarse(e) {
  e.preventDefault();
  const nombre    = document.getElementById('inputNombre').value.trim();
  const usuario   = document.getElementById('inputUsuario').value.trim();
  const correo    = document.getElementById('inputCorreo').value.trim();
  const password  = document.getElementById('inputPassword').value;
  const confirmar = document.getElementById('inputConfirmar').value;

  if (!nombre || !usuario || !correo || !password || !confirmar) {
    alert('Por favor completa todos los campos.');
    return;
  }
  if (!correo.includes('@')) {
    alert('Ingresa un correo electrónico válido.');
    return;
  }
  if (password.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres.');
    return;
  }
  if (password !== confirmar) {
    alert('Las contraseñas no coinciden.');
    return;
  }

  ipcRenderer.send('registrar-usuario', { nombre, usuario, correo, password });
}

ipcRenderer.on('registro-respuesta', (event, respuesta) => {
  if (respuesta.exito) {
    alert('Cuenta creada correctamente. Ahora inicia sesión.');
    window.location.href = '../index.html';
  } else {
    alert(respuesta.mensaje);
  }
});
