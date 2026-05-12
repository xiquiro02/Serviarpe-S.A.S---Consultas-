import pool from "../config/db.js";
import sql from "mssql";

export const YearModel = {

    findAll: async () => {
        const resultado = await pool.request().query("SELECT * FROM anios");
        return resultado.recordset;
    },

    findById: async (id) => {
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query("SELECT * FROM anios WHERE id = @id");
        return resultado.recordset[0] || null;
    },

    createYear: async (anio) => {
        const resultado = await pool.request()
            .input('anio', sql.NVarChar, anio)
            .query("INSERT INTO anios (anio) OUTPUT INSERTED.* VALUES (@anio)");
        return resultado.recordset[0];
    },

    updateYear: async (id, anio) => {
        const resultado = await pool.request()
            .input('id',   sql.Int,      id)
            .input('anio', sql.NVarChar, anio)
            .query("UPDATE anios SET anio = @anio OUTPUT INSERTED.* WHERE id = @id");
        return resultado.recordset[0];
    },

    deleteYear: async (id) => {
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM anios WHERE id = @id");
        return { eliminado: true };
    }
};