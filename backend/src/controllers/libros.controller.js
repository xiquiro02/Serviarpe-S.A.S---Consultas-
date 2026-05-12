import { BooksModel } from "../models/libroModel.js";

    export const getAllBooks = async (req, res) => {
        try {
            const libros = await BooksModel.findAll();
            res.json(libros);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener los libros", error: error.message });
        }
    };

    export const getBooksById =  async (req, res) => {
        try {
            const { id } = req.params;
            const libro = await BooksModel.findById(id);

            if (!libro) {
                return res.status(404).json({ mensaje: "Libro no encontrado" });
            }

            res.json(libro);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener el libro", error: error.message });
        }
    };

    export const createBooks = async (req, res) => {
        try {
            const { nombre } = req.body;

            if (!nombre) {
                return res.status(400).json({ mensaje: "El campo nombre es obligatorio" });
            }

            const nuevoLibro = await BooksModel.createBook(nombre);
            res.status(201).json({ mensaje: "Libro creado correctamente", data: nuevoLibro });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al crear el libro", error: error.message });
        }
    };

    export const updateBooks = async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre } = req.body;

            if (!nombre) {
                return res.status(400).json({ mensaje: "El campo nombre es obligatorio" });
            }

            const existe = await BooksModel.findById(id);
            if (!existe) {
                return res.status(404).json({ mensaje: "Libro no encontrado" });
            }

            const actualizado = await BooksModel.updateBook(id, nombre);
            res.json({ mensaje: "Libro actualizado correctamente", data: actualizado });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al actualizar el libro", error: error.message });
        }
    };

    export const deleteBooks = async (req, res) => {
        try {
            const { id } = req.params;

            const existe = await BooksModel.findById(id);
            if (!existe) {
                return res.status(404).json({ mensaje: "Libro no encontrado" });
            }

            await BooksModel.deleteBook(id);
            res.json({ mensaje: "Libro eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al eliminar el libro", error: error.message });
        }
    };