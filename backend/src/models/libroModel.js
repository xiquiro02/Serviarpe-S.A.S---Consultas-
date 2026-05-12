import pool from "../config/db.js";
import sql from "mssql";

export const BooksModel = {

    findAll: async () => {
        const resultado = await pool.request().query("SELECT * FROM libros");
        return resultado.recordset;
    },

    findById: async (id) => {
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query("SELECT * FROM libros WHERE id = @id");
        return resultado.recordset[0] || null;
    },

    createBook: async (nombre) => {
        const resultado = await pool.request()
            .input('nombre', sql.NVarChar, nombre)
            .query(`INSERT INTO libros (nombre) OUTPUT INSERTED.* VALUES (@nombre)`);
        return resultado.recordset[0];
    },

    updateBook: async (id, nombre) => {
        const resultado = await pool.request()
            .input('id',     sql.Int,      id)
            .input('nombre', sql.NVarChar, nombre)
            .query(`
                UPDATE libros 
                SET nombre = @nombre
                OUTPUT INSERTED.* 
                WHERE id = @id
            `);
        return resultado.recordset[0];
    },

    deleteBook: async (id) => {
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM libros WHERE id = @id");
        return { eliminado: true };
    }
};