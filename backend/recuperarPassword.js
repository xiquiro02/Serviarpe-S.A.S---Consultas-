// ================================ IMPORTACIÓN DE MÓDULOS ================================

// Conexión a la base de datos
const db = require('../database')
// Librería para encriptar contraseñas
const bcrypt = require('bcryptjs')
// Librería para enviar correos electrónicos
const nodemailer = require('nodemailer')
// Configuración del correo (usuario y contraseña de aplicación)
const emailConfig = require('../emailConfig')


// ================================ CONFIGURACIÓN DEL TRANSPORTER ================================

// Se crea el transporte para enviar correos usando Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.correo,       // Correo emisor
    pass: emailConfig.passwordApp   // Contraseña de aplicación
  }
})


// ================================ FUNCIÓN PARA GENERAR CÓDIGO ================================

// Genera un código aleatorio de 6 dígitos (ej: 483920)
function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}


// ================================ PASO 1: ENVIAR CÓDIGO AL CORREO ================================
async function enviarCodigo(correo) {
  try {

    // Buscar si el correo existe en la tabla usuarios
    const usuario = db.prepare('SELECT * FROM usuarios WHERE correo = ?').get(correo)

    // Si no existe, se devuelve error
    if (!usuario) {
      return { exito: false, mensaje: 'No existe una cuenta con ese correo' }
    }

    // Generar código de verificación
    const codigo = generarCodigo()
    // Definir fecha de expiración (15 minutos desde ahora)
    const expira = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    // Eliminar códigos anteriores de ese correo (evita duplicados)
    db.prepare('DELETE FROM reset_tokens WHERE correo = ?').run(correo)

    // Guardar el nuevo código en la base de datos
    db.prepare(
      'INSERT INTO reset_tokens (correo, token, expira_en) VALUES (?, ?, ?)'
    ).run(correo, codigo, expira)


    // ================================ ENVÍO DE CORREO ================================
    await transporter.sendMail({

      // Remitente
      from: `"Serviarpe S.A.S" <${emailConfig.correo}>`,

      // Destinatario
      to: correo,

      // Asunto
      subject: 'Recuperación de contraseña - Serviarpe S.A.S',

      // Contenido HTML del correo
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1a3a5c;">Recuperación de contraseña</h2>
          <p>Hola <strong>${usuario.nombre}</strong>,</p>
          <p>Tu código de verificación es:</p>

          <!-- Código destacado -->
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; text-align: center; color: #1a3a5c; padding: 16px 0;">
            ${codigo}
          </div>

          <!-- Información de expiración -->
          <p style="color: #666;">
            Este código expira en <strong>15 minutos</strong>.
            Si no solicitaste este cambio, ignora este mensaje.
          </p>

          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;">

          <!-- Pie de correo -->
          <p style="font-size: 12px; color: #999;">Serviarpe S.A.S ESP</p>
        </div>
      `
    })

    // Respuesta exitosa
    return { exito: true, mensaje: 'Código enviado al correo' }

  } catch (error) {

    // Si ocurre un error al enviar correo
    console.error('Error enviando correo:', error)

    return {
      exito: false,
      mensaje: 'No se pudo enviar el correo. Verifica la configuración.'
    }
  }
}


// ================================ PASO 2: CAMBIAR CONTRASEÑA ================================

function cambiarPassword(correo, codigo, nuevaPassword) {
  try {

    // Buscar el token válido en la base de datos
    const token = db.prepare(`
      SELECT * FROM reset_tokens
      WHERE correo = ? AND token = ? AND usado = 0
    `).get(correo, codigo)

    // Si no existe o ya fue usado
    if (!token) {
      return { exito: false, mensaje: 'Código incorrecto o ya utilizado' }
    }

    // Verificar si el código expiró
    if (new Date() > new Date(token.expira_en)) {
      return { exito: false, mensaje: 'El código ha expirado. Solicita uno nuevo.' }
    }

    // Encriptar la nueva contraseña
    const passwordEncriptada = bcrypt.hashSync(nuevaPassword, 10)

    // Actualizar la contraseña en la tabla usuarios
    db.prepare(
      'UPDATE usuarios SET password = ? WHERE correo = ?'
    ).run(passwordEncriptada, correo)

    // Marcar el token como usado
    db.prepare(
      'UPDATE reset_tokens SET usado = 1 WHERE id = ?'
    ).run(token.id)

    // Respuesta exitosa
    return { exito: true, mensaje: 'Contraseña actualizada correctamente' }

  } catch (error) {

    // Manejo de error general
    return { exito: false, mensaje: 'Error al cambiar la contraseña' }
  }
}


// ================================ EXPORTACIÓN DE FUNCIONES ================================
// Se exportan para poder usarlas en otros archivos
module.exports = { enviarCodigo, cambiarPassword }