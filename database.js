const Database = require('better-sqlite3')  // Importa la librería better-sqlite3 para manejar SQLite
const path = require('path')  // Importa path para manejar rutas del sistema de archivos
const bcrypt = require('bcryptjs')  // Importa bcrypt para encriptar contraseñas

// Crea o abre la base de datos llamada "datos.db"
// __dirname → ruta actual del archivo
const db = new Database(path.join(__dirname, 'datos.db'))

// Ejecuta múltiples sentencias SQL (crear tablas y triggers)
db.exec(`

  -- ============================
  -- TABLA USUARIOS
  -- ============================
  CREATE TABLE IF NOT EXISTS usuarios (
    id         INTEGER PRIMARY KEY AUTOINCREMENT, -- ID único autoincremental
    nombre     TEXT NOT NULL,                     -- Nombre completo
    usuario    TEXT NOT NULL UNIQUE,              -- Nombre de usuario (único)
    correo     TEXT NOT NULL UNIQUE,              -- Correo electrónico (único)
    foto       TEXT DEFAULT NULL,                 -- Ruta de foto (opcional)
    password   TEXT NOT NULL,                     -- Contraseña (encriptada)
    rol        TEXT DEFAULT 'empleado',           -- Rol (empleado o administrador)
    created_at TEXT DEFAULT (datetime('now')),    -- Fecha de creación automática
    updated_at TEXT DEFAULT (datetime('now'))     -- Fecha de actualización automática
  );

  -- Trigger para actualizar automáticamente el campo updated_at
  CREATE TRIGGER IF NOT EXISTS actualizar_usuarios
  AFTER UPDATE ON usuarios
  BEGIN
    UPDATE usuarios 
    SET updated_at = datetime('now') -- coloca la fecha actual
    WHERE id = NEW.id;               -- solo en el registro actualizado
  END;


  -- ============================
  -- TABLA LIBROS
  -- ============================
  CREATE TABLE IF NOT EXISTS libros (
    id         INTEGER PRIMARY KEY AUTOINCREMENT, -- ID único
    nombre     TEXT NOT NULL,                     -- Nombre del libro
    created_at TEXT DEFAULT (datetime('now')),    -- Fecha de creación
    updated_at TEXT DEFAULT (datetime('now'))     -- Fecha de actualización
  );

  -- Trigger para actualizar fecha automáticamente
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
    id         INTEGER PRIMARY KEY AUTOINCREMENT, -- ID único
    numero     TEXT NOT NULL,                     -- Número de la caja
    ubicacion  TEXT,                              -- Ubicación física
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Trigger para actualizar fecha automáticamente
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
    id         INTEGER PRIMARY KEY AUTOINCREMENT, -- ID único
    anio       TEXT NOT NULL,                     -- Año (ej: 2024)
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Trigger para actualizar fecha automáticamente
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
    id         INTEGER PRIMARY KEY AUTOINCREMENT, -- ID único
    nombre     TEXT NOT NULL,                     -- Nombre de la persona
    cedula     TEXT NOT NULL UNIQUE,              -- Documento único
    cargo      TEXT,                              -- Cargo o puesto
    libro_id   INTEGER,                           -- Relación con libros
    caja_id    INTEGER,                           -- Relación con cajas
    anio_id    INTEGER,                           -- Relación con años
    posicion   TEXT,                              -- Posición o ubicación
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),

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
  -- TABLA TOKENS RECUPERACIÓN
  -- ============================
  CREATE TABLE IF NOT EXISTS reset_tokens (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    correo     TEXT NOT NULL,
    token      TEXT NOT NULL,
    expira_en  TEXT NOT NULL,
    usado      INTEGER DEFAULT 0
  );

`)


// ============================
// CREAR ADMIN POR DEFECTO
// ============================
// Consulta si ya existe un usuario con rol administrador
const adminExiste = db.prepare(
  `SELECT COUNT(*) as total FROM usuarios WHERE rol = 'administrador'`
).get()

// Si no existe ningún administrador
if (adminExiste.total === 0) {

  // Encripta la contraseña "admin123"
  const passwordEncriptada = bcrypt.hashSync('admin123', 10)

  // Inserta el usuario administrador por defecto
  db.prepare(`
    INSERT INTO usuarios (nombre, usuario, correo, password, rol)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    'Administrador',                      // nombre
    'admin',                              // usuario
    'serviarpesasesp@gmail.com',          // correo
    passwordEncriptada,                   // contraseña encriptada
    'administrador'                       // rol
  )

  // Mensajes en consola para informar credenciales
  console.log('============================')
  console.log('Usuario admin creado')
  console.log('Usuario:  admin')
  console.log('Password: admin123')
  console.log('============================')
}

// Mensaje indicando que la base de datos está lista
console.log('Base de datos lista')

// Exporta la conexión para usarla en otros archivos
module.exports = db