async function iniciarSesion() {
  const usuario  = document.getElementById('usuario').value.trim();
  const password = document.getElementById('contrasena').value.trim();

  if (!usuario || !password) {
    Swal.fire({ icon: 'warning', title: 'Campos vacíos', text: 'Por favor llena todos los campos.', confirmButtonColor: '#007ABF' });
    return;
  }

  try {
    const { ok, data } = await loginUsuario(usuario, password);
    if (ok && data.exito) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      window.location.href = 'pages/menuPrincipal.html';
    } else {
      Swal.fire({ icon: 'error', title: 'Acceso denegado', text: data.mensaje, confirmButtonColor: '#007ABF' });
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo conectar con el servidor.', confirmButtonColor: '#007ABF' });
  }
}
