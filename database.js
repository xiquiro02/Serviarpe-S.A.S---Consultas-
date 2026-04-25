const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'datos.db'))

db.exec(`

  -- TABLA USUARIOS
  CREATE TABLE IF NOT EXISTS usuarios (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre     TEXT NOT NULL,
    usuario    TEXT NOT NULL UNIQUE,
    correo     TEXT NOT NULL UNIQUE,
    foto       TEXT DEFAULT NULL,
    password   TEXT NOT NULL,
    rol        TEXT DEFAULT 'empleado',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TRIGGER IF NOT EXISTS actualizar_usuarios
  AFTER UPDATE ON usuarios
  BEGIN
    UPDATE usuarios 
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
  END;

  -- TABLA LIBROS
  CREATE TABLE IF NOT EXISTS libros (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre     TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TRIGGER IF NOT EXISTS actualizar_libros
  AFTER UPDATE ON libros
  BEGIN
    UPDATE libros 
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
  END;

  -- TABLA CAJAS
  CREATE TABLE IF NOT EXISTS cajas (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    numero     TEXT NOT NULL,
    ubicacion  TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TRIGGER IF NOT EXISTS actualizar_cajas
  AFTER UPDATE ON cajas
  BEGIN
    UPDATE cajas 
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
  END;

  -- TABLA AÑOS
  CREATE TABLE IF NOT EXISTS anios (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    anio       TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TRIGGER IF NOT EXISTS actualizar_anios
  AFTER UPDATE ON anios
  BEGIN
    UPDATE anios 
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
  END;

  -- TABLA PERSONAL
  CREATE TABLE IF NOT EXISTS personal (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre     TEXT NOT NULL,
    cedula     TEXT NOT NULL UNIQUE,
    cargo      TEXT,
    libro_id   INTEGER,
    caja_id    INTEGER,
    anio_id    INTEGER,
    posicion   TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (libro_id) REFERENCES libros(id),
    FOREIGN KEY (caja_id)  REFERENCES cajas(id),
    FOREIGN KEY (anio_id)  REFERENCES anios(id)
  );

  CREATE TRIGGER IF NOT EXISTS actualizar_personal
  AFTER UPDATE ON personal
  BEGIN
    UPDATE personal 
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
  END;

`)

// CREA ADMIN POR DEFECTO
const adminExiste = db.prepare(
  `SELECT COUNT(*) as total FROM usuarios WHERE rol = 'administrador'`
).get()

if (adminExiste.total === 0) {
  db.prepare(`
    INSERT INTO usuarios (nombre, usuario, correo, password, rol)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    'Administrador',
    'admin',
    'serviarpesasesp@gmail.com',
    'admin123',
    'administrador'
  )
  console.log('============================')
  console.log('Usuario admin creado ✅')
  console.log('Usuario:  admin')
  console.log('Password: admin123')
  console.log('============================')
}

console.log('Base de datos lista ✅')
module.exports = db