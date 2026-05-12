import pool from "../config/db.js";
import sql from "mssql";

export const ResetTokenModel = {

    findByCorreo: async (correo) => {
        const resultado = await pool.request()
            .input('correo', sql.NVarChar, correo)
            .query("SELECT * FROM reset_tokens WHERE correo = @correo AND usado = 0");
        return resultado.recordset[0] || null;
    },

    findByToken: async (correo, token) => {
        const resultado = await pool.request()
            .input('correo', sql.NVarChar, correo)
            .input('token',  sql.NVarChar, token)
            .query(`
                SELECT * FROM reset_tokens 
                WHERE correo = @correo 
                  AND token  = @token 
                  AND usado  = 0
            `);
        return resultado.recordset[0] || null;
    },

    createToken: async (correo, token, expira_en) => {
        const resultado = await pool.request()
            .input('correo',    sql.NVarChar, correo)
            .input('token',     sql.NVarChar, token)
            .input('expira_en', sql.DateTime, expira_en)
            .query(`INSERT INTO reset_tokens (correo, token, expira_en) OUTPUT INSERTED.* VALUES (@correo, @token, @expira_en)`);
        return resultado.recordset[0];
    },

    marcarUsado: async (id) => {
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE reset_tokens 
                SET usado = 1
                OUTPUT INSERTED.*
                WHERE id = @id
            `);
        return resultado.recordset[0];
    },

    deleteByCorreo: async (correo) => {
        await pool.request()
            .input('correo', sql.NVarChar, correo)
            .query("DELETE FROM reset_tokens WHERE correo = @correo");
        return { eliminado: true };
    }
};