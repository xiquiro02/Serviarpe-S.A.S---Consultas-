import { ResetTokenModel } from "../models/resetTokenModel.js";
import { UserModel } from "../models/usuarioModel.js";
import nodemailer from "nodemailer";
import "dotenv/config";

// ─── Configuración del transporter de correo ─────────────────────────────────
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_CORREO,
        pass: process.env.EMAIL_PASSWORD_APP
    }
});

// ─── Genera código aleatorio de 6 dígitos ────────────────────────────────────
const generarCodigo = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const ResetTokenController = {

    // PASO 1 — Enviar código al correo
    enviarCodigo: async (req, res) => {
        try {
            const { correo } = req.body;

            if (!correo) {
                return res.status(400).json({ mensaje: "El campo correo es obligatorio" });
            }

            // Verificar que el correo esté registrado
            const usuario = await UserModel.findByCorreo(correo);
            if (!usuario) {
                return res.status(404).json({ mensaje: "No existe una cuenta con ese correo" });
            }

            // Eliminar tokens anteriores de ese correo
            await ResetTokenModel.deleteByCorreo(correo);

            // Generar nuevo código y fecha de expiración (15 minutos)
            const token    = generarCodigo();
            const expira_en = new Date(Date.now() + 15 * 60 * 1000);

            // Guardar token en la base de datos
            await ResetTokenModel.createToken(correo, token, expira_en);

            // Enviar correo
            await transporter.sendMail({
                from:    `"Serviarpe S.A.S" <${process.env.EMAIL_CORREO}>`,
                to:      correo,
                subject: "Recuperación de contraseña - Serviarpe S.A.S",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
                        <h2 style="color: #1a3a5c;">Recuperación de contraseña</h2>
                        <p>Hola <strong>${usuario.nombre}</strong>,</p>
                        <p>Tu código de verificación es:</p>
                        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; text-align: center; color: #1a3a5c; padding: 16px 0;">
                            ${token}
                        </div>
                        <p style="color: #666;">
                            Este código expira en <strong>15 minutos</strong>.
                            Si no solicitaste este cambio, ignora este mensaje.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;">
                        <p style="font-size: 12px; color: #999;">Serviarpe S.A.S ESP</p>
                    </div>
                `
            });

            res.json({ exito: true, mensaje: "Código enviado al correo" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al enviar el código", error: error.message });
        }
    },

    // PASO 2 — Verificar código
    verificarCodigo: async (req, res) => {
        try {
            const { correo, token } = req.body;

            if (!correo || !token) {
                return res.status(400).json({ mensaje: "Los campos correo y token son obligatorios" });
            }

            const resetToken = await ResetTokenModel.findByToken(correo, token);

            if (!resetToken) {
                return res.status(400).json({ mensaje: "Código incorrecto o ya utilizado" });
            }

            // Verificar si el código expiró
            if (new Date() > new Date(resetToken.expira_en)) {
                return res.status(400).json({ mensaje: "El código ha expirado, solicita uno nuevo" });
            }

            res.json({ exito: true, mensaje: "Código verificado correctamente" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al verificar el código", error: error.message });
        }
    },

    // PASO 3 — Cambiar contraseña
    cambiarPassword: async (req, res) => {
        try {
            const { correo, token, nuevaPassword } = req.body;

            if (!correo || !token || !nuevaPassword) {
                return res.status(400).json({ mensaje: "Los campos correo, token y nuevaPassword son obligatorios" });
            }

            if (nuevaPassword.length < 6) {
                return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres" });
            }

            // Buscar token válido
            const resetToken = await ResetTokenModel.findByToken(correo, token);
            if (!resetToken) {
                return res.status(400).json({ mensaje: "Código incorrecto o ya utilizado" });
            }

            // Verificar expiración
            if (new Date() > new Date(resetToken.expira_en)) {
                return res.status(400).json({ mensaje: "El código ha expirado, solicita uno nuevo" });
            }

            // Cambiar contraseña
            await UserModel.updatePasswordByCorreo(correo, nuevaPassword);

            // Marcar token como usado
            await ResetTokenModel.marcarUsado(resetToken.id);

            res.json({ exito: true, mensaje: "Contraseña actualizada correctamente" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al cambiar la contraseña", error: error.message });
        }
    }
};