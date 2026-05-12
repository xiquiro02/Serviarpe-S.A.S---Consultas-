import { Router } from "express";
import { ResetTokenController } from "../controllers/resetToken.controller.js";

const ResetTokenRouter = Router();

ResetTokenRouter.post("/enviar",   ResetTokenController.enviarCodigo);
ResetTokenRouter.post("/verificar", ResetTokenController.verificarCodigo);
ResetTokenRouter.post("/cambiar",  ResetTokenController.cambiarPassword);

export default ResetTokenRouter;
