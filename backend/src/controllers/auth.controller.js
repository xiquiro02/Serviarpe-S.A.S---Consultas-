import { UserModel } from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const login = async (req, res) => {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({ mensaje: "Los campos usuario y contraseña son obligatorios" });
        }

        const usuarioEncontrado = await UserModel.findByUsuario(usuario);
        if (!usuarioEncontrado) {
            return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
        }

        const passwordCorrecta = bcrypt.compareSync(password, usuarioEncontrado.password);
        if (!passwordCorrecta) {
            return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
        }

        const token = jwt.sign(
            { id: usuarioEncontrado.id, usuario: usuarioEncontrado.usuario, rol: usuarioEncontrado.rol },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        const { password: _, ...datosUsuario } = usuarioEncontrado;

        res.json({
            exito: true,
            token,
            usuario: datosUsuario
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al iniciar sesión", error: error.message });
    }
};

export const registro = async (req, res) => {
    try {
        const { nombre, usuario, correo, password } = req.body;

        if (!nombre || !usuario || !correo || !password) {
            return res.status(400).json({ mensaje: "Los campos nombre, usuario, correo y contraseña son obligatorios" });
        }

        if (password.length < 6) {
            return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres" });
        }

        if (!correo.includes('@')) {
            return res.status(400).json({ mensaje: "El correo no es válido" });
        }

        const nuevo = await UserModel.createUser({ nombre, usuario, correo, password, rol: 'empleado' });
        res.status(201).json({ exito: true, mensaje: "Usuario registrado correctamente", data: nuevo });
    } catch (error) {
        if (error.message === 'El usuario o correo ya existe') {
            return res.status(409).json({ mensaje: error.message });
        }
        res.status(500).json({ mensaje: "Error al registrar el usuario", error: error.message });
    }
};
