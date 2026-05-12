import sql from "mssql";
import "dotenv/config";

const config = {
    server:   process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        instanceName:           process.env.DB_INSTANCE || 'SQLEXPRESS',
        encrypt:                false,
        trustServerCertificate: true,
    },
    pool: {
        max:              10,
        min:              0,
        idleTimeoutMillis: 30000
    }
};

const pool = await sql.connect(config)
    .then(p => { console.log("Conexión a SQL Server establecida con éxito"); return p; })
    .catch(err => { console.error("Error al conectar con la base de datos:", err.message); process.exit(1); });

export default pool;