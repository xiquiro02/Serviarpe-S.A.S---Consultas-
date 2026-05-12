import { Router } from "express";
import {
    getAllBooks, 
    getBooksById, 
    createBooks, 
    updateBooks, 
    deleteBooks
} from "../controllers/libros.controller.js";

const BooksRouter = Router(); 

BooksRouter.get("/",        getAllBooks);
BooksRouter.get("/:id",     getBooksById);
BooksRouter.post("/",       createBooks);
BooksRouter.put("/:id",     updateBooks);
BooksRouter.delete("/:id",  deleteBooks);

export default BooksRouter; 