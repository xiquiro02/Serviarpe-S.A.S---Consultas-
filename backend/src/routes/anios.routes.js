import { Router } from "express";
import {
    getAllYears, 
    getYearsById, 
    createYears, 
    updateYears, 
    deleteYears,
} from "../controllers/anios.controller.js"

const YearsRouter = Router();

YearsRouter.get("/",        getAllYears);
YearsRouter.get("/:id",     getYearsById);
YearsRouter.post("/",       createYears);
YearsRouter.put("/:id",     updateYears);
YearsRouter.delete("/:id",  deleteYears);

export default YearsRouter; 