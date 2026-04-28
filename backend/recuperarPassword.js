const db = require('../database')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const emailConfig = require('../emailConfig')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.correo,
    pass: emailConfig.passwordApp
  }
})

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Paso 1: el usuario pide el código
async function enviarCodigo(correo) {
  try {
    const usuario = db.prepare('SELECT * FROM usuarios WHERE correo = ?').get(correo)
    if (!usuario) {
      return { exito: false, mensaje: 'No existe una cuenta con ese correo' }
    }

    const codigo = generarCodigo()
    // Expira en 15 minutos
    const expira = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    // Elimina tokens anteriores del mismo correo
    db.prepare('DELETE FROM reset_tokens WHERE correo = ?').run(correo)

    // Guarda el nuevo token
    db.prepare('INSERT INTO reset_tokens (correo, token, expira_en) VALUES (?, ?, ?)').run(correo, codigo, expira)

    await transporter.sendMail({
      from: `"Serviarpe S.A.S" <${emailConfig.correo}>`,
      to: correo,
      subject: 'Recuperación de contraseña - Serviarpe S.A.S',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1a3a5c;">Recuperación de contraseña</h2>
          <p>Hola <strong>${usuario.nombre}</strong>,</p>
          <p>Tu código de verificación es:</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; text-align: center; color: #1a3a5c; padding: 16px 0;">
            ${codigo}
          </div>
          <p style="color: #666;">Este código expira en <strong>15 minutos</strong>. Si no solicitaste este cambio, ignora este mensaje.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;">
          <p style="font-size: 12px; color: #999;">Serviarpe S.A.S ESP</p>
        </div>
      `
    })

    return { exito: true, mensaje: 'Código enviado al correo' }

  } catch (error) {
    console.error('Error enviando correo:', error)
    return { exito: false, mensaje: 'No se pudo enviar el correo. Verifica la configuración.' }
  }
}

// Paso 2: el usuario verifica el código y cambia la contraseña
function cambiarPassword(correo, codigo, nuevaPassword) {
  try {
    const token = db.prepare(`
      SELECT * FROM reset_tokens
      WHERE correo = ? AND token = ? AND usado = 0
    `).get(correo, codigo)

    if (!token) {
      return { exito: false, mensaje: 'Código incorrecto o ya utilizado' }
    }

    if (new Date() > new Date(token.expira_en)) {
      return { exito: false, mensaje: 'El código ha expirado. Solicita uno nuevo.' }
    }

    const passwordEncriptada = bcrypt.hashSync(nuevaPassword, 10)
    db.prepare('UPDATE usuarios SET password = ? WHERE correo = ?').run(passwordEncriptada, correo)
    db.prepare('UPDATE reset_tokens SET usado = 1 WHERE id = ?').run(token.id)

    return { exito: true, mensaje: 'Contraseña actualizada correctamente' }

  } catch (error) {
    return { exito: false, mensaje: 'Error al cambiar la contraseña' }
  }
}

module.exports = { enviarCodigo, cambiarPassword }
