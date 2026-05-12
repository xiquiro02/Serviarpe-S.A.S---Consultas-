import pool from "../config/db.js";
import sql from "mssql";

export const PersonalModel = {

    findAll: async () => {
        const resultado = await pool.request().query(`
            SELECT p.*, 
                   l.nombre   AS libro_nombre,
                   c.numero   AS caja_numero,
                   c.ubicacion AS caja_ubicacion,
                   a.anio     AS anio_valor
            FROM personal p
            LEFT JOIN libros l ON p.libro_id = l.id
            LEFT JOIN cajas  c ON p.caja_id  = c.id
            LEFT JOIN anios  a ON p.anio_id  = a.id
            ORDER BY p.nombre
        `);
        return resultado.recordset;
    },

    findById: async (id) => {
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT p.*, 
                       l.nombre    AS libro_nombre,
                       c.numero    AS caja_numero,
                       c.ubicacion AS caja_ubicacion,
                       a.anio      AS anio_valor
                FROM personal p
                LEFT JOIN libros l ON p.libro_id = l.id
                LEFT JOIN cajas  c ON p.caja_id  = c.id
                LEFT JOIN anios  a ON p.anio_id  = a.id
                WHERE p.id = @id
            `);
        return resultado.recordset[0] || null;
    },

    findByLibro: async (libro_id) => {
        const resultado = await pool.request()
            .input('libro_id', sql.Int, libro_id)
            .query(`
                SELECT p.*, 
                       c.numero    AS caja_numero,
                       c.ubicacion AS caja_ubicacion,
                       a.anio      AS anio_valor
                FROM personal p
                LEFT JOIN cajas c ON p.caja_id = c.id
                LEFT JOIN anios a ON p.anio_id = a.id
                WHERE p.libro_id = @libro_id
                ORDER BY p.nombre
            `);
        return resultado.recordset;
    },

    createPersonal: async (datos) => {
        const { nombre, cedula, cargo, libro_id, caja_id, anio_id, posicion } = datos;
        try {
            const resultado = await pool.request()
                .input('nombre',   sql.NVarChar, nombre)
                .input('cedula',   sql.NVarChar, cedula)
                .input('cargo',    sql.NVarChar, cargo    || null)
                .input('libro_id', sql.Int,      libro_id || null)
                .input('caja_id',  sql.Int,      caja_id  || null)
                .input('anio_id',  sql.Int,      anio_id  || null)
                .input('posicion', sql.NVarChar, posicion || null)
                .query(`
                    INSERT INTO personal (nombre, cedula, cargo, libro_id, caja_id, anio_id, posicion) OUTPUT INSERTED.* VALUES (@nombre, @cedula, @cargo, @libro_id, @caja_id, @anio_id, @posicion)
                `);
            return resultado.recordset[0];
        } catch (error) {
            // Captura el UNIQUE (cedula, libro_id)
            if (error.number === 2627) {
                throw new Error('Esa cédula ya está registrada en este libro');
            }
            throw error;
        }
    },

    updatePersonal: async (id, datos) => {
        const { nombre, cedula, cargo, caja_id, anio_id, posicion } = datos;
        const resultado = await pool.request()
            .input('id',       sql.Int,      id)
            .input('nombre',   sql.NVarChar, nombre)
            .input('cedula',   sql.NVarChar, cedula)
            .input('cargo',    sql.NVarChar, cargo    || null)
            .input('caja_id',  sql.Int,      caja_id  || null)
            .input('anio_id',  sql.Int,      anio_id  || null)
            .input('posicion', sql.NVarChar, posicion || null)
            .query(`
                UPDATE personal 
                SET nombre   = @nombre,
                    cedula   = @cedula,
                    cargo    = @cargo,
                    caja_id  = @caja_id,
                    anio_id  = @anio_id,
                    posicion = @posicion
                OUTPUT INSERTED.*
                WHERE id = @id
            `);
        return resultado.recordset[0];
    },

    deletePersonal: async (id) => {
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM personal WHERE id = @id");
        return { eliminado: true };
    }
};