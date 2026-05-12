import express            from "express";
import cors               from "cors";
import path               from "path";
import { fileURLToPath }  from "url";
import "dotenv/config";
import "./src/config/db.js";

import { verificarToken } from "./src/middlewares/auth.middleware.js";

import AuthRouter       from "./src/routes/auth.routes.js";
import ResetRouter      from "./src/routes/resetToken.routes.js";
import UserRouter       from "./src/routes/usuarios.routes.js";
import PersonalRouter   from "./src/routes/personal.routes.js";
import BooksRouter      from "./src/routes/libros.routes.js";
import BoxesRouter      from "./src/routes/cajas.routes.js";
import YearsRouter      from "./src/routes/anios.routes.js";

const app      = express();
const PORT     = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const FRONTEND   = path.join(__dirname, "../Frontend");

// ── Middlewares ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Archivos estáticos del Frontend ──────────────────────
app.use(express.static(FRONTEND));

// ── Rutas públicas (no requieren token) ──────────────────
app.use("/api/auth",           AuthRouter);
app.use("/api/auth/recuperar", ResetRouter);

// ── Middleware de autenticación (protege todo lo de abajo) ─
app.use(verificarToken);

// ── Rutas privadas ────────────────────────────────────────
app.use("/api/usuarios",  UserRouter);
app.use("/api/personal",  PersonalRouter);
app.use("/api/libros",    BooksRouter);
app.use("/api/cajas",     BoxesRouter);
app.use("/api/anios",     YearsRouter);

// ── Cualquier otra ruta sirve el Frontend (SPA) ──────────
app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(FRONTEND, "index.html"));
});

// ── Arrancar servidor ────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
