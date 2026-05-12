import jwt from "jsonwebtoken";
import "dotenv/config";

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ mensaje: "Acceso denegado: token requerido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch {
        return res.status(403).json({ mensaje: "Token inválido o expirado" });
    }
};

export const soloAdmin = (req, res, next) => {
    if (req.usuario?.rol !== "administrador") {
        return res.status(403).json({ mensaje: "Acceso denegado: se requiere rol administrador" });
    }
    next();
};
