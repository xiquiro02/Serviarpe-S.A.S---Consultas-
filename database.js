const Database = require('better-sqlite3')
const path = require('path')

// Crea o abre el archivo datos.db
const db = new Database(path.join(__dirname, 'datos.db'))

// Crea las tablas si no existen
db.exec(`

  CREATE TABLE IF NOT EXISTS usuarios (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario   TEXT NOT NULL UNIQUE,
    password  TEXT NOT NULL,
    rol       TEXT DEFAULT 'usuario'
  );

  CREATE TABLE IF NOT EXISTS personal (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre  TEXT NOT NULL,
    cedula  TEXT NOT NULL UNIQUE,
    cargo   TEXT
  );

  CREATE TABLE IF NOT EXISTS libros (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS registros (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre    TEXT,
    cedula    TEXT,
    caja      TEXT,
    ubicacion TEXT,
    posicion  TEXT,
    libro_id  INTEGER,
    fecha     TEXT DEFAULT (date('now'))
  );

`)

console.log('Base de datos lista ✅')
module.exports = db