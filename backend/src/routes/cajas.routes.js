import { Router } from "express";
import { 
    getAllBoxes, 
    getBoxesById, 
    createBoxes, 
    updateBoxes, 
    deleteBoxes
} from "../controllers/cajas.controller.js";

const BoxesRouter = Router();

BoxesRouter.get("/",        getAllBoxes);
BoxesRouter.get("/:id",     getBoxesById);
BoxesRouter.post("/",       createBoxes); 
BoxesRouter.put("/:id",     updateBoxes);
BoxesRouter.delete("/:id",  deleteBoxes);

export default BoxesRouter;