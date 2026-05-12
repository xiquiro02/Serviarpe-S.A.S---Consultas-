import { Router } from "express";
import { login, registro } from "../controllers/auth.controller.js";

const AuthRouter = Router();

AuthRouter.post("/login",    login);
AuthRouter.post("/registro", registro);

export default AuthRouter;
