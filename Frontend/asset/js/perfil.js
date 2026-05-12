// Importa módulos necesarios
const path   = require('path'); // Manejo de rutas
const db     = require(path.join(process.cwd(), 'database')); // Conexión a la base de datos
const bcrypt = require('bcryptjs'); // Para encriptar y comparar contraseñas

// Obtiene el usuario guardado en el navegador (localStorage)
const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');

// Extrae el ID del usuario actual
const userId = usuarioGuardado.id;


// ================================ CARGAR DATOS DEL PERFIL ================================
(function cargarPerfil() {

  // Si no hay usuario, no hace nada
  if (!userId) return;

  // Busca el usuario en la base de datos
  const u = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(userId);

  // Si no existe, no continúa
  if (!u) return;

  // Llena los inputs del formulario con los datos del usuario
  document.getElementById('inputNombre').value = u.nombre;
  document.getElementById('inputEmail').value  = u.correo || '';

  // Actualiza el nombre en el encabezado del perfil
  const perfilNombre = document.querySelector('.perfil-nombre');
  if (perfilNombre) perfilNombre.textContent = u.nombre;

})();


// ================================ VISTA PREVIA DE FOTO  ================================
// Detecta cuando el usuario selecciona una imagen
document.getElementById('inputFoto').addEventListener('change', function () {

  const file = this.files[0]; // Obtiene el archivo seleccionado

  if (!file) return; // Si no hay archivo, sale

  const reader = new FileReader(); // Permite leer archivos

  // Cuando se carga la imagen
  reader.onload = e => {
    // Muestra la imagen en el elemento img
    document.getElementById('fotoPreview').src = e.target.result;
  };

  // Convierte la imagen en base64 para mostrarla
  reader.readAsDataURL(file);
});


// ================================ GUARDAR DATOS DEL PERFIL  ================================
function guardarDatos(e) {

  e.preventDefault(); // Evita recargar la página

  // Obtiene los valores del formulario
  const nombre = document.getElementById('inputNombre').value.trim();
  const correo = document.getElementById('inputEmail').value.trim();

  // Validación: nombre obligatorio
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

  try {

    // Actualiza los datos en la base de datos
    db.prepare('UPDATE usuarios SET nombre=?, correo=? WHERE id=?')
      .run(nombre, correo, userId);

    // Vuelve a consultar el usuario actualizado
    const u = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(userId);

    // Actualiza el usuario en localStorage
    localStorage.setItem('usuario', JSON.stringify(u));

    // Actualiza el nombre en el perfil
    const perfilNombre = document.querySelector('.perfil-nombre');
    if (perfilNombre) perfilNombre.textContent = nombre;

    // Actualiza el nombre en otros lugares donde se muestre
    document.querySelectorAll('.user-nombre').forEach(el => {
      el.textContent = nombre;
    });

    // Mensaje de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Guardado!',
      text: 'Datos actualizados correctamente.',
      confirmButtonColor: '#27ae60',
      confirmButtonText: 'Aceptar'
    });

  } catch (err) {

    // Error en actualización
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo actualizar el perfil.',
      confirmButtonColor: '#007ABF'
    });
  }
}

// ================================ CAMBIAR CONTRASEÑA  ================================
function cambiarContrasena(e) {

  e.preventDefault();

  // Obtiene los valores de los inputs
  const actual    = document.getElementById('inputPassActual').value;
  const nueva     = document.getElementById('inputPassNueva').value;
  const confirmar = document.getElementById('inputPassConfirmar').value;

  // Validación: campos completos
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

  // Validación: longitud mínima
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

  // Validación: coincidencia
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

  // Busca el usuario actual
  const u = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(userId);

  // Verifica la contraseña actual usando bcrypt
  if (!bcrypt.compareSync(actual, u.password)) {
    Swal.fire({
      icon: 'error',
      title: 'Contraseña incorrecta',
      text: 'La contraseña actual no es correcta.',
      confirmButtonColor: '#F76927',
      confirmButtonText: 'Entendido'
    });
    return;
  }

  // Actualiza la contraseña en la base de datos (encriptada)
  db.prepare('UPDATE usuarios SET password=? WHERE id=?')
    .run(bcrypt.hashSync(nueva, 10), userId);

  // Mensaje de éxito
  Swal.fire({
    icon: 'success',
    title: '¡Contraseña cambiada!',
    text: 'Tu contraseña fue actualizada correctamente.',
    confirmButtonColor: '#27ae60',
    confirmButtonText: 'Aceptar'
  });

  // Limpia el formulario
  e.target.reset();
}


// ================================ MOSTRAR / OCULTAR CONTRASEÑA  ================================
function togglePass(inputId, btn) {

  const input = document.getElementById(inputId);
  // Verifica si está visible
  const visible = input.type === 'text';

  // Cambia el tipo de input
  input.type = visible ? 'password' : 'text';

  // Cambia estilo del botón (por ejemplo icono activo)
  btn.classList.toggle('visible', !visible);
}


// ================================ CERRAR SESIÓN ================================
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
  }).then(result => {

    // Si el usuario confirma
    if (result.isConfirmed) {

      // Elimina el usuario del localStorage
      localStorage.removeItem('usuario');

      // Redirige al login
      window.location.href = '../index.html';
    }
  });
}