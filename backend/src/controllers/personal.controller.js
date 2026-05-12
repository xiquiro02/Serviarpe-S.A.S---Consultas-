import { PersonalModel } from "../models/personalModel.js";

    export const getAllPersonal = async (req, res) => {
        try {
            const personal = await PersonalModel.findAll();
            res.json(personal);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener el personal", error: error.message });
        }
    };

    export const getPersonalById = async (req, res) => {
        try {
            const { id } = req.params;
            const persona = await PersonalModel.findById(id);

            if (!persona) {
                return res.status(404).json({ mensaje: "Registro no encontrado" });
            }

            res.json(persona);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener el registro", error: error.message });
        }
    };

    export const getPersonalByLibro = async (req, res) => {
        try {
            const { libro_id } = req.params;
            const personal = await PersonalModel.findByLibro(libro_id);
            res.json(personal);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener el personal del libro", error: error.message });
        }
    };

    export const createPersonal = async (req, res) => {
        try {
            const { nombre, cedula, cargo, libro_id, caja_id, anio_id, posicion } = req.body;

            if (!nombre || !cedula) {
                return res.status(400).json({ mensaje: "Los campos nombre y cedula son obligatorios" });
            }

            const nuevo = await PersonalModel.createPersonal({
                nombre,
                cedula,
                cargo,
                libro_id,
                caja_id,
                anio_id,
                posicion
            });

            res.status(201).json({ mensaje: "Registro creado correctamente", data: nuevo });
        } catch (error) {
            // Error de cédula duplicada en el mismo libro
            if (error.message === 'Esa cédula ya está registrada en este libro') {
                return res.status(400).json({ mensaje: error.message });
            }
            res.status(500).json({ mensaje: "Error al crear el registro", error: error.message });
        }
    };

    export const updatePersonal = async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, cedula, cargo, caja_id, anio_id, posicion } = req.body;

            if (!nombre || !cedula) {
                return res.status(400).json({ mensaje: "Los campos nombre y cedula son obligatorios" });
            }

            const existe = await PersonalModel.findById(id);
            if (!existe) {
                return res.status(404).json({ mensaje: "Registro no encontrado" });
            }

            const actualizado = await PersonalModel.updatePersonal(id, {
                nombre,
                cedula,
                cargo,
                caja_id,
                anio_id,
                posicion
            });

            res.json({ mensaje: "Registro actualizado correctamente", data: actualizado });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al actualizar el registro", error: error.message });
        }
    };

    export const deletePersonal = async (req, res) => {
        try {
            const { id } = req.params;

            const existe = await PersonalModel.findById(id);
            if (!existe) {
                return res.status(404).json({ mensaje: "Registro no encontrado" });
            }

            await PersonalModel.deletePersonal(id);
            res.json({ mensaje: "Registro eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al eliminar el registro", error: error.message });
        }
    };