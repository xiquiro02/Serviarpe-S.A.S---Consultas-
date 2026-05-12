import { UserModel } from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";

    export const  getAllUser = async (req, res) => {
            try {
                const usuarios = await UserModel.findAll();
                res.json(usuarios);
            } catch (error) {
                res.status(500).json({ mensaje: "Error al obtener los usuarios", error: error.message });
            }
    };

    export const getUserById =  async (req, res) => {
            try {
                const { id } = req.params;
                const usuario = await UserModel.findById(id);

                if (!usuario) {
                    return res.status(404).json({ mensaje: "Usuario no encontrado" });
                }

                res.json(usuario);
            } catch (error) {
                res.status(500).json({ mensaje: "Error al obtener el usuario", error: error.message });
            }
    };

    export const createUser =  async (req, res) => {
        try {
            const { nombre, usuario, correo, password, rol } = req.body;

            if (!nombre || !usuario || !correo || !password) {
                return res.status(400).json({ mensaje: "Los campos nombre, usuario, correo y password son obligatorios" });
            }

            if (password.length < 6) {
                return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres" });
            }

            if (!correo.includes('@')) {
                return res.status(400).json({ mensaje: "El correo no es válido" });
            }

            const nuevo = await UserModel.createUser({ nombre, usuario, correo, password, rol });
            res.status(201).json({ mensaje: "Usuario creado correctamente", data: nuevo });
        } catch (error) {
            if (error.message === 'El usuario o correo ya existe') {
                return res.status(409).json({ mensaje: error.message });
            }
            res.status(500).json({ mensaje: "Error al crear el usuario", error: error.message });
        }
    };

    export const updateUser = async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, correo, foto } = req.body;

            if (!nombre || !correo) {
                return res.status(400).json({ mensaje: "Los campos nombre y correo son obligatorios" });
            }

            if (!correo.includes('@')) {
                return res.status(400).json({ mensaje: "El correo no es válido" });
            }

            const existe = await UserModel.findById(id);
            if (!existe) {
                return res.status(404).json({ mensaje: "Usuario no encontrado" });
            }

            const actualizado = await UserModel.updateUser(id, { nombre, correo, foto });
            res.json({ mensaje: "Usuario actualizado correctamente", data: actualizado });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al actualizar el usuario", error: error.message });
        }
    };

    export const updatePasswordUser = async (req, res) => {
        try {
            const { id } = req.params;
            const { passwordActual, nuevaPassword } = req.body;

            if (!passwordActual || !nuevaPassword) {
                return res.status(400).json({ mensaje: "Los campos Contraseña Actual y nueva Contraseña son obligatorios" });
            }

            if (nuevaPassword.length < 6) {
                return res.status(400).json({ mensaje: "La nueva contraseña debe tener al menos 6 caracteres" });
            }

            // Busca el usuario con password para comparar
            const usuario = await UserModel.findById(id);
            if (!usuario) {
                return res.status(404).json({ mensaje: "Usuario no encontrado" });
            }

            // Verifica que la contraseña actual sea correcta
            const usuarioCompleto = await UserModel.findByUsuario(usuario.usuario);
            const passwordCorrecta = bcrypt.compareSync(passwordActual, usuarioCompleto.password);
            if (!passwordCorrecta) {
                return res.status(401).json({ mensaje: "La contraseña actual es incorrecta" });
            }

            await UserModel.updatePassword(id, nuevaPassword);
            res.json({ mensaje: "Contraseña actualizada correctamente" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al actualizar la contraseña", error: error.message });
        }
    };

    export const updateRolUser = async (req, res) => {
        try {
            const { id } = req.params;
            const { rol } = req.body;

            if (!rol) {
                return res.status(400).json({ mensaje: "El campo rol es obligatorio" });
            }

            const rolesValidos = ['administrador', 'empleado'];
            if (!rolesValidos.includes(rol)) {
                return res.status(400).json({ mensaje: "El rol debe ser administrador o empleado" });
            }

            const existe = await UserModel.findById(id);
            if (!existe) {
                return res.status(404).json({ mensaje: "Usuario no encontrado" });
            }

            const actualizado = await UserModel.updateRol(id, rol);
            res.json({ mensaje: "Rol actualizado correctamente", data: actualizado });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al actualizar el rol", error: error.message });
        }
    };

    export const deleteUser = async (req, res) => {
        try {
            const { id } = req.params;

            const existe = await UserModel.findById(id);
            if (!existe) {
                return res.status(404).json({ mensaje: "Usuario no encontrado" });
            }

            if (existe.rol === 'administrador'){
                return res.status(403).json({mensaje : "No se puede eliminar un Usuario Administrador"})
            }

            await UserModel.deleteUser(id);
            res.json({ mensaje: "Usuario eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al eliminar el usuario", error: error.message });
        }
    };