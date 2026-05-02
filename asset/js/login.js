// Importa el módulo ipcRenderer de Electron
// Permite comunicación entre el frontend (renderer) y el backend (main)
const { ipcRenderer } = require('electron')

// Función que se ejecuta cuando el usuario intenta iniciar sesión
function iniciarSesion() {
  // Obtiene el valor del campo "usuario" y elimina espacios innecesarios
  const usuario = document.getElementById('usuario').value.trim()
  // Obtiene el valor del campo "contraseña" y elimina espacios
  const password = document.getElementById('contrasena').value.trim()

  // ===== VALIDACIÓN DE CAMPOS =====
  // Verifica que ambos campos tengan contenido
  if (!usuario || !password) {

    // Muestra una alerta si hay campos vacíos
    Swal.fire({
      icon: 'warning',
      title: 'Campos vacíos',
      text: 'Por favor llena todos los campos.',
      confirmButtonColor: '#007ABF'
    })

    return // Detiene la ejecución
  }

  // ===== ENVÍO DE DATOS AL BACKEND =====
  // Envía un evento llamado 'login' al proceso principal (main)
  // Se envía un objeto con usuario y contraseña
  ipcRenderer.send('login', { usuario, password })
}


// ===== RECEPCIÓN DE RESPUESTA DEL BACKEND =====
// Escucha el evento 'login-respuesta' enviado desde el proceso principal
ipcRenderer.on('login-respuesta', (event, respuesta) => {
  // Si el login fue exitoso
  if (respuesta.exito) {
    // Guarda los datos del usuario en el localStorage
    // Se convierte a texto con JSON.stringify
    localStorage.setItem('usuario', JSON.stringify(respuesta.usuario))

    // Redirige al menú principal (dashboard)
    window.location.href = 'pages/menuPrincipal.html'

  } else {
    // Si falla el login, muestra mensaje de error
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: respuesta.mensaje,
      confirmButtonColor: '#007ABF'
    })
  }
})