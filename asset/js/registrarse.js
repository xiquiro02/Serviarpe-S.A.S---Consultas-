// Importa el módulo ipcRenderer de Electron
// Permite enviar datos del frontend (vista) al backend (proceso principal)
const { ipcRenderer } = require('electron');


// ================================ FUNCIÓN REGISTRARSE ================================
function registrarse(e) {
  // Evita que el formulario recargue la página
  e.preventDefault();

  // Obtiene los valores de los inputs
  const nombre    = document.getElementById('inputNombre').value.trim();
  const usuario   = document.getElementById('inputUsuario').value.trim();
  const correo    = document.getElementById('inputCorreo').value.trim();
  const password  = document.getElementById('inputPassword').value;
  const confirmar = document.getElementById('inputConfirmar').value;

  // ================================ VALIDACIONES ================================

  // Verifica que todos los campos estén completos
  if (!nombre || !usuario || !correo || !password || !confirmar) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos.',
      confirmButtonColor: '#007ABF'
    });
    return;
  }

  // Validación básica de correo (contiene @)
  if (!correo.includes('@')) {
    Swal.fire({
      icon: 'warning',
      title: 'Correo inválido',
      text: 'Ingresa un correo electrónico válido.',
      confirmButtonColor: '#007ABF'
    });
    return;
  }

  // Validación de longitud mínima de contraseña
  if (password.length < 6) {
    Swal.fire({
      icon: 'warning',
      title: 'Contraseña muy corta',
      text: 'La contraseña debe tener al menos 6 caracteres.',
      confirmButtonColor: '#007ABF'
    });
    return;
  }

  // Verifica que las contraseñas coincidan
  if (password !== confirmar) {
    Swal.fire({
      icon: 'warning',
      title: 'No coinciden',
      text: 'Las contraseñas no coinciden.',
      confirmButtonColor: '#007ABF'
    });
    return;
  }

  // ================================ ENVÍO DE DATOS AL BACKEND ================================

  // Envía los datos al proceso principal de Electron
  // 'registrar-usuario' es el canal de comunicación
  ipcRenderer.send('registrar-usuario', {
    nombre,
    usuario,
    correo,
    password
  });
}


// ================================ RESPUESTA DEL BACKEND ================================

// Escucha la respuesta del proceso principal
ipcRenderer.on('registro-respuesta', (event, respuesta) => {

  // Si el registro fue exitoso
  if (respuesta.exito) {

    // Muestra mensaje de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Cuenta creada!',
      text: 'Ahora puedes iniciar sesión.',
      confirmButtonColor: '#007ABF'
    })

    // Redirige al login
    .then(() => {
      window.location.href = '../index.html';
    });

  } else {

    // Si ocurrió un error (ej: usuario ya existe)
    Swal.fire({
      icon: 'error',
      title: 'Error al registrar',
      text: respuesta.mensaje,
      confirmButtonColor: '#007ABF'
    });
  }
});