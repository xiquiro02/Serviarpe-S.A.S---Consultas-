// Importa el módulo ipcRenderer de Electron
// Permite la comunicación entre el frontend (renderer) y el backend (main)
const { ipcRenderer } = require('electron')

// Variable para guardar el correo ingresado en el paso 1
let correoGuardado = ''


// ================================ PASO 1: ENVIAR CÓDIGO AL CORREO ================================
function enviarCodigo() {

  // Obtiene el correo ingresado por el usuario
  const correo = document.getElementById('correo').value.trim()

  // Validación: campo vacío
  if (!correo) {
    mostrarMensaje('Por favor ingresa tu correo electrónico.', 'error')
    return
  }

  // Obtiene el botón y lo desactiva para evitar múltiples envíos
  const btn = document.getElementById('btn-enviar')
  btn.disabled = true
  btn.textContent = 'Enviando...'

  // Envía el correo al proceso principal (backend)
  ipcRenderer.send('enviar-codigo-reset', { correo })
}


// Escucha la respuesta del backend después de enviar el código
ipcRenderer.on('codigo-reset-respuesta', (event, respuesta) => {

  // Reactiva el botón
  const btn = document.getElementById('btn-enviar')
  btn.disabled = false
  btn.textContent = 'Enviar'

  // Si el envío fue exitoso
  if (respuesta.exito) {

    // Guarda el correo para usarlo en el paso 2
    correoGuardado = document.getElementById('correo').value.trim()

    // Muestra mensaje de éxito
    mostrarMensaje('Código enviado. Revisa tu correo.', 'exito')

    // Oculta el paso 1
    document.getElementById('paso-1').style.display = 'none'
    // Muestra el paso 2 (verificación)
    document.getElementById('paso-2').style.display = 'block'

  } else {

    // Muestra error si algo falló
    mostrarMensaje(respuesta.mensaje, 'error')
  }
})


// ================================ PASO 2: CAMBIAR CONTRASEÑA  ================================
function cambiarPassword() {

  // Obtiene los valores ingresados
  const codigo        = document.getElementById('codigo').value.trim()
  const nuevaPass     = document.getElementById('nueva-password').value
  const confirmarPass = document.getElementById('confirmar-password').value

  // Validación: campos completos
  if (!codigo || !nuevaPass || !confirmarPass) {
    mostrarMensaje('Por favor completa todos los campos.', 'error')
    return
  }

  // Validación: longitud mínima de la contraseña
  if (nuevaPass.length < 6) {
    mostrarMensaje('La contraseña debe tener al menos 6 caracteres.', 'error')
    return
  }

  // Validación: coincidencia de contraseñas
  if (nuevaPass !== confirmarPass) {
    mostrarMensaje('Las contraseñas no coinciden.', 'error')
    return
  }

  // Envía los datos al backend para cambiar la contraseña
  ipcRenderer.send('cambiar-password', {
    correo: correoGuardado, // correo guardado del paso 1
    codigo,                 // código ingresado
    nuevaPassword: nuevaPass
  })
}


// Escucha la respuesta del backend al cambiar la contraseña
ipcRenderer.on('cambiar-password-respuesta', (event, respuesta) => {

  if (respuesta.exito) {

    // Mensaje de éxito
    mostrarMensaje('¡Contraseña cambiada exitosamente!', 'exito')

    // Redirige al login después de 2 segundos
    setTimeout(() => {
      window.location.href = '../index.html'
    }, 2000)

  } else {

    // Muestra error si algo falló
    mostrarMensaje(respuesta.mensaje, 'error')
  }
})


// ================================ REENVIAR CÓDIGO ================================
function reenviarCodigo() {

  // Vuelve al paso 1
  document.getElementById('paso-2').style.display = 'none'
  document.getElementById('paso-1').style.display = 'block'

  // Limpia el mensaje
  mostrarMensaje('', '')
}


// ================================ MOSTRAR MENSAJES EN PANTALLA ================================
function mostrarMensaje(texto, tipo) {
  // Obtiene el elemento donde se mostrará el mensaje
  const el = document.getElementById('mensaje')
  // Inserta el texto del mensaje
  el.textContent = texto

  // Cambia la clase para aplicar estilos (error, exito, etc.)
  el.className = 'mensaje ' + tipo
}