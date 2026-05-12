import { YearModel } from "../models/anioModel.js";

    export const getAllYears = async (req, res) => {
        try {
            const anios = await YearModel.findAll();
            res.json(anios);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener los años", error: error.message });
        }
    };

    export const getYearsById = async (req, res) => {
        try {
            const { id } = req.params;
            const anio = await YearModel.findById(id);

            if (!anio) {
                return res.status(404).json({ mensaje: "Año no encontrado" });
            }
            res.json(anio);
            
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener el año", error: error.message });
        }
    };

    export const createYears = async (req, res) => {
        try {
            const { anio } = req.body;

            if (!anio) {
                return res.status(400).json({ mensaje: "El campo anio es obligatorio" });
            }

            const nuevoAnio = await YearModel.createYear(anio);
            res.status(201).json({ mensaje: "Año creado correctamente", data: nuevoAnio });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al crear el año", error: error.message });
        }
    };

    export const updateYears = async (req, res) => {
        try {
            const { id } = req.params;
            const { anio } = req.body;

            if (!anio) {
                return res.status(400).json({ mensaje: "El campo anio es obligatorio" });
            }

            const existe = await YearModel.findById(id);
            if (!existe) {
                return res.status(404).json({ mensaje: "Año no encontrado" });
            }

            const actualizado = await YearModel.updateYear(id, anio);
            res.json({ mensaje: "Año actualizado correctamente", data: actualizado });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al actualizar el año", error: error.message });
        }
    };

    export const deleteYears = async (req, res) => {
        try {
            const { id } = req.params;

            const existe = await YearModel.findById(id);
            if (!existe) {
                return res.status(404).json({ mensaje: "Año no encontrado" });
            }

            await YearModel.deleteYear(id);
            res.json({ mensaje: "Año eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al eliminar el año", error: error.message });
        }
    };