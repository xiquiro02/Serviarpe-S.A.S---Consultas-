// ================================ IMPORTACIÓN DE LIBRERÍAS ================================
// Librería para trabajar con SQLite de forma rápida y sin promesas
const Database = require('better-sqlite3')
// Módulo para manejar rutas del sistema
const path = require('path')
// Librería para encriptar contraseñas
const bcrypt = require('bcryptjs')


// ================================ CREACIÓN / CONEXIÓN A LA BD ================================
// Se crea o abre el archivo datos.db en la misma carpeta del proyecto
// __dirname = ruta actual del archivo
const db = new Database(path.join(__dirname, 'datos.db'))


// ================================ CREACIÓN DE TABLAS Y TRIGGERS ================================
// db.exec permite ejecutar múltiples sentencias SQL de una sola vez
db.exec(`

  -- ============================
  -- TABLA USUARIOS
  -- ============================
  CREATE TABLE IF NOT EXISTS usuarios (
    id         INTEGER PRIMARY KEY AUTOINCREMENT, -- Identificador único
    nombre     TEXT NOT NULL,                     -- Nombre completo
    usuario    TEXT NOT NULL UNIQUE,              -- Username único
    correo     TEXT NOT NULL UNIQUE,              -- Correo único
    foto       TEXT DEFAULT NULL,                 -- Foto (opcional)
    password   TEXT NOT NULL,                     -- Contraseña encriptada
    rol        TEXT DEFAULT 'empleado',           -- Rol del usuario
    created_at TEXT DEFAULT (datetime('now')),    -- Fecha de creación
    updated_at TEXT DEFAULT (datetime('now'))     -- Fecha de actualización
  );

  -- Trigger: se ejecuta automáticamente cuando se actualiza un usuario
  CREATE TRIGGER IF NOT EXISTS actualizar_usuarios
  AFTER UPDATE ON usuarios
  BEGIN
    UPDATE usuarios 
    SET updated_at = datetime('now') -- Actualiza la fecha automáticamente
    WHERE id = NEW.id;               -- Solo al registro modificado
  END;


  -- ============================
  -- TABLA LIBROS
  -- ============================
  CREATE TABLE IF NOT EXISTS libros (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre     TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Trigger para actualizar fecha
  CREATE TRIGGER IF NOT EXISTS actualizar_libros
  AFTER UPDATE ON libros
  BEGIN
    UPDATE libros 
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
  END;


  -- ============================
  -- TABLA CAJAS
  -- ============================
  CREATE TABLE IF NOT EXISTS cajas (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    numero     TEXT NOT NULL,   -- Número identificador
    ubicacion  TEXT,            -- Ubicación física
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Trigger de actualización automática
  CREATE TRIGGER IF NOT EXISTS actualizar_cajas
  AFTER UPDATE ON cajas
  BEGIN
    UPDATE cajas 
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
  END;


  -- ============================
  -- TABLA AÑOS
  -- ============================
  CREATE TABLE IF NOT EXISTS anios (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    anio       TEXT NOT NULL,   -- Año (ej: 2026)
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Trigger para mantener updated_at actualizado
  CREATE TRIGGER IF NOT EXISTS actualizar_anios
  AFTER UPDATE ON anios
  BEGIN
    UPDATE anios 
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
  END;


  -- ============================
  -- TABLA PERSONAL
  -- ============================
  CREATE TABLE IF NOT EXISTS personal (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre     TEXT NOT NULL,        -- Nombre de la persona
    cedula     TEXT NOT NULL,        -- Documento único
    cargo      TEXT,                 -- Cargo o rol laboral
    libro_id   INTEGER,              -- Relación con libro
    caja_id    INTEGER,              -- Relación con caja
    anio_id    INTEGER,              -- Relación con año
    posicion   TEXT,                 -- Ubicación dentro del archivo
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),

    UNIQUE (cedula, libro_id),
    -- Relaciones (claves foráneas)
    FOREIGN KEY (libro_id) REFERENCES libros(id),
    FOREIGN KEY (caja_id)  REFERENCES cajas(id),
    FOREIGN KEY (anio_id)  REFERENCES anios(id)
  );

  -- Trigger para actualizar fecha automáticamente
  CREATE TRIGGER IF NOT EXISTS actualizar_personal
  AFTER UPDATE ON personal
  BEGIN
    UPDATE personal
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
  END;


  -- ============================
  -- TABLA TOKENS (RECUPERACIÓN)
  -- ============================
  CREATE TABLE IF NOT EXISTS reset_tokens (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    correo     TEXT NOT NULL,   -- Correo del usuario
    token      TEXT NOT NULL,   -- Código de verificación
    expira_en  TEXT NOT NULL,   -- Fecha de expiración
    usado      INTEGER DEFAULT 0 -- 0 = no usado, 1 = usado
  );

`)

// ================================
// CREACIÓN DE ADMIN POR DEFECTO
// ================================

// Consulta si ya existe un usuario administrador
const adminExiste = db.prepare(
  `SELECT COUNT(*) as total FROM usuarios WHERE rol = 'administrador'`
).get()

// Si no existe ningún administrador en el sistema
if (adminExiste.total === 0) {

  // Se encripta la contraseña inicial
  const passwordEncriptada = bcrypt.hashSync('admin123', 10)

  // Se inserta el usuario administrador por defecto
  db.prepare(`
    INSERT INTO usuarios (nombre, usuario, correo, password, rol)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    'Administrador',               // Nombre
    'admin',                       // Usuario
    'serviarpesasesp@gmail.com',   // Correo
    passwordEncriptada,            // Password encriptado
    'administrador'                // Rol
  )

  // Mensaje informativo en consola
  console.log('============================')
  console.log('Usuario admin creado')
  console.log('Usuario:  admin')
  console.log('Password: admin123')
  console.log('============================')
}

// ================================ MENSAJE FINAL ================================
// Indica que la base de datos está lista para usarse
console.log('Base de datos lista')

// ================================ EXPORTACIÓN ================================
// Permite usar la conexión en otros archivos del proyecto
module.exports = db