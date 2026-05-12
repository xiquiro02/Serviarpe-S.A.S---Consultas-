import pool from "../config/db.js";
import sql from "mssql";

export const BoxesModel = {

    findAll: async () => {
        const resultado = await pool.request().query("SELECT * FROM cajas");
        return resultado.recordset;
    },

    findById: async (id) => {
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query("SELECT * FROM cajas WHERE id = @id");
        return resultado.recordset[0] || null;
    },

    createBox: async (numero, ubicacion) => {
        const resultado = await pool.request()
            .input('numero',    sql.NVarChar, numero)
            .input('ubicacion', sql.NVarChar, ubicacion || null)
            .query(`INSERT INTO cajas (numero, ubicacion) OUTPUT INSERTED.* VALUES (@numero, @ubicacion)`);
        return resultado.recordset[0];
    },

    updateBox: async (id, numero, ubicacion) => {
        const resultado = await pool.request()
            .input('id',        sql.Int,      id)
            .input('numero',    sql.NVarChar, numero)
            .input('ubicacion', sql.NVarChar, ubicacion || null)
            .query(`
                UPDATE cajas 
                SET numero    = @numero, 
                    ubicacion = @ubicacion
                OUTPUT INSERTED.* 
                WHERE id = @id
            `);
        return resultado.recordset[0];
    },

    deleteBox: async (id) => {
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM cajas WHERE id = @id");
        return { eliminado: true };
    }
};