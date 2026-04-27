// Importa el módulo ipcRenderer de Electron
// Esto permite enviar y recibir mensajes entre el frontend y el backend. 
const { ipcRenderer } = require('electron')

function iniciarSesion() {    // Función que se ejecuta cuando el usuario hace clic en "Ingresar"

  // Obtiene el valor del input con id "usuario"
  // trim() elimina espacios en blanco al inicio y al final
  const usuario  = document.getElementById('usuario').value.trim()

  // Obtiene el valor del input de la contraseña
  const password = document.getElementById('contrasena').value.trim()


  // Valida si alguno de los campos está vacío
  if (!usuario || !password) {
    alert('Por favor llena todos los campos')  // Muestra un mensaje al usuario
    return  // Detiene la ejecución de la función
  }

  // Envía un mensaje al proceso principal de Electron
  // 'login' es el canal (nombre del evento)
  // { usuario, password } son los datos que se envían
  ipcRenderer.send('login', { usuario, password })
}

// Escucha una respuesta desde el proceso principal 'login-respuesta' es el canal por donde llega la respuesta
ipcRenderer.on('login-respuesta', (event, respuesta) => {
  // Verifica si el login fue exitoso
  if (respuesta.exito) {
    // Guarda los datos del usuario en el navegador (localStorage)
    // JSON.stringify convierte el objeto en texto para poder guardarlo
    localStorage.setItem('usuario', JSON.stringify(respuesta.usuario))

    window.location.href = 'pages/menuPrincipal.html'  // Redirige al usuario a la página principal (dashboard)

  } else {
    // Si el login falla, muestra el mensaje enviado desde el backend
    alert(respuesta.mensaje)
  }
})