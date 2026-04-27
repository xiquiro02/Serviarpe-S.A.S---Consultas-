// Importa la conexión a la base de datos
const db = require('../database')
// Importa la librería bcrypt para encriptar y comparar contraseñas
const bcrypt = require('bcryptjs')

// ================================
// LOGIN
// ================================

function login(datos) {   // Función para iniciar sesión
  try {
    // Busca el usuario SOLO por el nombre de usuario (ya no se busca por password porque ahora está encriptada).
    const usuario = db.prepare(`
      SELECT * FROM usuarios WHERE usuario = ?
    `).get(datos.usuario)

    // Si no existe el usuario
    if (!usuario) {
      // Retorna error genérico (buena práctica de seguridad)
      return { exito: false, mensaje: 'Usuario o contraseña incorrectos' }
    }

    // Compara la contraseña ingresada con la contraseña encriptada
    // bcrypt.compareSync:
    // - datos.password → lo que escribió el usuario
    // - usuario.password → lo que está guardado (encriptado)
    const passwordCorrecta = bcrypt.compareSync(datos.password, usuario.password)

    // Si la contraseña coincide
    if (passwordCorrecta) {
      // Retorna éxito junto con los datos del usuario
      return { exito: true, usuario: usuario }

    } else {
      // Si no coincide → mismo mensaje genérico
      return { exito: false, mensaje: 'Usuario o contraseña incorrectos' }
    }

  } catch (error) {
    // Si ocurre un error (BD, código, etc.)
    return { exito: false, mensaje: 'Error al iniciar sesión' }
  }
}

// ================================
// REGISTRO
// ================================

function registrar(datos) {   // Función para registrar un nuevo usuario
  try {

    // Encripta la contraseña antes de guardarla
    // hashSync:
    // - datos.password → contraseña original
    // - 10 → nivel de complejidad (salt rounds)
    const passwordEncriptada = bcrypt.hashSync(datos.password, 10)

    // Inserta el nuevo usuario en la base de datos
    db.prepare(`
      INSERT INTO usuarios (nombre, usuario, correo, password, rol)
      VALUES (?, ?, ?, ?, 'empleado')
    `).run(
      datos.nombre, 
      datos.usuario, 
      datos.correo, 
      passwordEncriptada // se guarda encriptada, NO en texto plano
    )

    // Retorna éxito
    return { exito: true, mensaje: 'Usuario registrado correctamente' }

  } catch (error) {
    // Si falla (por ejemplo: usuario o correo duplicado por UNIQUE)
    return { exito: false, mensaje: 'El usuario o correo ya existe' }
  }
}

// Exporta las funciones para que puedan ser usadas en otros archivos
module.exports = { login, registrar }