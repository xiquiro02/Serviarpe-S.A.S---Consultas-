import pool from "../config/db.js";
import sql from "mssql";
import bcrypt from "bcryptjs";

export const UserModel = {

    findAll: async () => {
        const resultado = await pool.request().query(`SELECT id, nombre, usuario, correo, foto, rol, created_at, updated_at FROM usuariosORDER BY id`);
        return resultado.recordset;
    },

    findById: async (id) => {
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT id, nombre, usuario, correo, foto, rol, created_at, updated_at FROM usuarios WHERE id = @id`);
        return resultado.recordset[0] || null;
    },

    findByUsuario: async (usuario) => {
        const resultado = await pool.request()
            .input('usuario', sql.NVarChar, usuario)
            .query("SELECT * FROM usuarios WHERE usuario = @usuario");
        return resultado.recordset[0] || null;
    },

    findByCorreo: async (correo) => {
        const resultado = await pool.request()
            .input('correo', sql.NVarChar, correo)
            .query("SELECT * FROM usuarios WHERE correo = @correo");
        return resultado.recordset[0] || null;
    },

    createUser: async (datos) => {
        const { nombre, usuario, correo, password, rol = 'empleado' } = datos;
        try {
            const hash = bcrypt.hashSync(password, 10);
            const resultado = await pool.request()
                .input('nombre',   sql.NVarChar, nombre)
                .input('usuario',  sql.NVarChar, usuario)
                .input('correo',   sql.NVarChar, correo)
                .input('password', sql.NVarChar, hash)
                .input('rol',      sql.NVarChar, rol)
                .query(`
                    INSERT INTO usuarios (nombre, usuario, correo, password, rol)
                    OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.usuario, 
                           INSERTED.correo, INSERTED.rol, INSERTED.created_at
                    VALUES (@nombre, @usuario, @correo, @password, @rol)
                `);
            return resultado.recordset[0];
        } catch (error) {
            // Captura UNIQUE de usuario o correo
            if (error.number === 2627) {
                throw new Error('El usuario o correo ya existe');
            }
            throw error;
        }
    },

    updateUser: async (id, datos) => {
        const { nombre, correo, foto } = datos;
        const resultado = await pool.request()
            .input('id',     sql.Int,      id)
            .input('nombre', sql.NVarChar, nombre)
            .input('correo', sql.NVarChar, correo)
            .input('foto',   sql.NVarChar, foto || null)
            .query(`
                UPDATE usuarios 
                SET nombre = @nombre,
                    correo = @correo,
                    foto   = @foto
                OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.usuario,
                       INSERTED.correo, INSERTED.foto, INSERTED.rol
                WHERE id = @id
            `);
        return resultado.recordset[0];
    },

    updatePassword: async (id, nuevaPassword) => {
        const hash = bcrypt.hashSync(nuevaPassword, 10);
        await pool.request()
            .input('id',       sql.Int,      id)
            .input('password', sql.NVarChar, hash)
            .query("UPDATE usuarios SET password = @password WHERE id = @id");
        return { actualizado: true };
    },

    updatePasswordByCorreo: async (correo, nuevaPassword) => {
        const hash = bcrypt.hashSync(nuevaPassword, 10);
        await pool.request()
            .input('correo',   sql.NVarChar, correo)
            .input('password', sql.NVarChar, hash)
            .query("UPDATE usuarios SET password = @password WHERE correo = @correo");
        return { actualizado: true };
    },

    updateRol: async (id, rol) => {
        const resultado = await pool.request()
            .input('id',  sql.Int,      id)
            .input('rol', sql.NVarChar, rol)
            .query(`
                UPDATE usuarios 
                SET rol = @rol
                OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.usuario, INSERTED.rol
                WHERE id = @id
            `);
        return resultado.recordset[0];
    },

    deleteUser: async (id) => {
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM usuarios WHERE id = @id");
        return { eliminado: true };
    }
};