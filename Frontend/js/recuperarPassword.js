let correoGuardado = '';

async function enviarCodigo() {
  const correo = document.getElementById('correo').value.trim();
  if (!correo) {
    mostrarMensaje('Por favor ingresa tu correo electrónico.', 'error');
    return;
  }

  const btn = document.getElementById('btn-enviar');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  try {
    const { ok, data } = await enviarCodigoRecuperacion(correo);
    btn.disabled = false;
    btn.textContent = 'Enviar';
    if (ok) {
      correoGuardado = correo;
      mostrarMensaje('Código enviado. Revisa tu correo.', 'exito');
      document.getElementById('paso-1').style.display = 'none';
      document.getElementById('paso-2').style.display = 'block';
    } else {
      mostrarMensaje(data.mensaje, 'error');
    }
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Enviar';
    mostrarMensaje('Error de conexión con el servidor.', 'error');
  }
}

async function cambiarPassword() {
  const codigo        = document.getElementById('codigo').value.trim();
  const nuevaPass     = document.getElementById('nueva-password').value;
  const confirmarPass = document.getElementById('confirmar-password').value;

  if (!codigo || !nuevaPass || !confirmarPass) {
    mostrarMensaje('Por favor completa todos los campos.', 'error');
    return;
  }
  if (nuevaPass.length < 6) {
    mostrarMensaje('La contraseña debe tener al menos 6 caracteres.', 'error');
    return;
  }
  if (nuevaPass !== confirmarPass) {
    mostrarMensaje('Las contraseñas no coinciden.', 'error');
    return;
  }

  try {
    const { ok, data } = await cambiarPasswordConCodigo(correoGuardado, codigo, nuevaPass);
    if (ok) {
      mostrarMensaje('¡Contraseña cambiada exitosamente!', 'exito');
      setTimeout(() => { window.location.href = '../index.html'; }, 2000);
    } else {
      mostrarMensaje(data.mensaje, 'error');
    }
  } catch (err) {
    mostrarMensaje('Error de conexión con el servidor.', 'error');
  }
}

function reenviarCodigo() {
  document.getElementById('paso-2').style.display = 'none';
  document.getElementById('paso-1').style.display = 'block';
  mostrarMensaje('', '');
}

function mostrarMensaje(texto, tipo) {
  const el = document.getElementById('mensaje');
  el.textContent = texto;
  el.className = 'mensaje ' + tipo;
}
