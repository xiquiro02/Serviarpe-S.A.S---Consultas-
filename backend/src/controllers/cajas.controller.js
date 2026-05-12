import { BoxesModel } from "../models/cajaModel.js";

    export const getAllBoxes = async (req, res) => {
        try {
            const cajas = await BoxesModel.findAll();
            res.json(cajas);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener las cajas", error: error.message });
        }
    };

    export const getBoxesById = async (req, res) => {
        try {
            const { id } = req.params;
            const caja = await BoxesModel.findById(id);

            if (!caja) {
                return res.status(404).json({ mensaje: "Caja no encontrada" });
            }

            res.json(caja);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener la caja", error: error.message });
        }
    };

    export const createBoxes = async (req, res) => {
        try {
            const { numero, ubicacion } = req.body;

            if (!numero) {
                return res.status(400).json({ mensaje: "El campo numero es obligatorio" });
            }

            const nuevaCaja = await BoxesModel.createBox(numero, ubicacion);
            res.status(201).json({ mensaje: "Caja creada correctamente", data: nuevaCaja });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al crear la caja", error: error.message });
        }
    };

    export const updateBoxes = async (req, res) => {
        try {
            const { id } = req.params;
            const { numero, ubicacion } = req.body;

            if (!numero) {
                return res.status(400).json({ mensaje: "El campo numero es obligatorio" });
            }

            const existe = await BoxesModel.findById(id);
            if (!existe) {
                return res.status(404).json({ mensaje: "Caja no encontrada" });
            }

            const actualizada = await BoxesModel.updateBox(id, numero, ubicacion);
            res.json({ mensaje: "Caja actualizada correctamente", data: actualizada });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al actualizar la caja", error: error.message });
        }
    };

    export const deleteBoxes = async (req, res) => {
        try {
            const { id } = req.params;

            const existe = await BoxesModel.findById(id);
            if (!existe) {
                return res.status(404).json({ mensaje: "Caja no encontrada" });
            }

            await BoxesModel.deleteBox(id);
            res.json({ mensaje: "Caja eliminada correctamente" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al eliminar la caja", error: error.message });
        }
    };