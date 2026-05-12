import { Router } from "express";
import {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    updatePasswordUser,
    updateRolUser,
    deleteUser
} from "../controllers/usuarios.controller.js"; 

const UserRouter = Router();

UserRouter.get("/",                 getAllUser);
UserRouter.get("/:id",              getUserById);
UserRouter.post("/",                createUser);
UserRouter.put("/:id",              updateUser);
UserRouter.patch("/:id/password",   updatePasswordUser);
UserRouter.patch("/:id/rol",        updateRolUser);
UserRouter.delete("/:id",           deleteUser);

export default UserRouter;