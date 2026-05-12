import { Router } from "express";
import {
    getAllPersonal, 
    getPersonalById, 
    getPersonalByLibro, 
    createPersonal, 
    updatePersonal, 
    deletePersonal
} from "../controllers/personal.controller.js";

const PersonalRouter = Router(); 

PersonalRouter.get("/",         getAllPersonal);
PersonalRouter.get("/:id",      getPersonalById); 
PersonalRouter.post("/",        createPersonal);
PersonalRouter.put("/:id",      updatePersonal);
PersonalRouter.delete("/:id",   deletePersonal);

PersonalRouter.get("/:id/libros", getPersonalByLibro); 

export default PersonalRouter; 