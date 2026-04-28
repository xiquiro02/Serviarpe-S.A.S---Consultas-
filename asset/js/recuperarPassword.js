const { ipcRenderer } = require('electron')

let correoGuardado = ''

// ── Paso 1: enviar código ──────────────────────────────────────
function enviarCodigo() {
  const correo = document.getElementById('correo').value.trim()
  if (!correo) {
    mostrarMensaje('Por favor ingresa tu correo electrónico.', 'error')
    return
  }

  const btn = document.getElementById('btn-enviar')
  btn.disabled = true
  btn.textContent = 'Enviando...'

  ipcRenderer.send('enviar-codigo-reset', { correo })
}

ipcRenderer.on('codigo-reset-respuesta', (event, respuesta) => {
  const btn = document.getElementById('btn-enviar')
  btn.disabled = false
  btn.textContent = 'Enviar'

  if (respuesta.exito) {
    correoGuardado = document.getElementById('correo').value.trim()
    mostrarMensaje('Código enviado. Revisa tu correo.', 'exito')
    document.getElementById('paso-1').style.display = 'none'
    document.getElementById('paso-2').style.display = 'block'
  } else {
    mostrarMensaje(respuesta.mensaje, 'error')
  }
})

// ── Paso 2: verificar código y cambiar contraseña ─────────────
function cambiarPassword() {
  const codigo       = document.getElementById('codigo').value.trim()
  const nuevaPass    = document.getElementById('nueva-password').value
  const confirmarPass = document.getElementById('confirmar-password').value

  if (!codigo || !nuevaPass || !confirmarPass) {
    mostrarMensaje('Por favor completa todos los campos.', 'error')
    return
  }

  if (nuevaPass.length < 6) {
    mostrarMensaje('La contraseña debe tener al menos 6 caracteres.', 'error')
    return
  }

  if (nuevaPass !== confirmarPass) {
    mostrarMensaje('Las contraseñas no coinciden.', 'error')
    return
  }

  ipcRenderer.send('cambiar-password', {
    correo: correoGuardado,
    codigo,
    nuevaPassword: nuevaPass
  })
}

ipcRenderer.on('cambiar-password-respuesta', (event, respuesta) => {
  if (respuesta.exito) {
    mostrarMensaje('¡Contraseña cambiada exitosamente!', 'exito')
    setTimeout(() => {
      window.location.href = '../index.html'
    }, 2000)
  } else {
    mostrarMensaje(respuesta.mensaje, 'error')
  }
})

function reenviarCodigo() {
  document.getElementById('paso-2').style.display = 'none'
  document.getElementById('paso-1').style.display = 'block'
  mostrarMensaje('', '')
}

function mostrarMensaje(texto, tipo) {
  const el = document.getElementById('mensaje')
  el.textContent = texto
  el.className = 'mensaje ' + tipo
}
