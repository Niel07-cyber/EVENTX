// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// dotenv.config({ path: join(__dirname, '../../.env') });

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT || '3306'),
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'eventx',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// // Test connection on startup
// pool.getConnection()
//   .then(conn => {
//     console.log('✅ Connected to MySQL database');
//     conn.release();
//   })
//   .catch(err => {
//     console.error('❌ Error connecting to MySQL database:', err.message);
//   });

// export default pool;

// server/db.js
import sql from "mssql";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

const config = {
  user: process.env.DB_USER || "sqladmin",
  password: process.env.DB_PASS || process.env.DB_PASSWORD, // Checks both names
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "appdb",
  options: {
    encrypt: true, // Required for Azure
    trustServerCertificate: false, // Change to true if using local dev
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Create a pool instance
const pool = new sql.ConnectionPool(config);

// Connect automatically when this file is imported
const poolConnect = pool
  .connect()
  .then(() => {
    console.log("✅ Connected to MSSQL database");
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err);
  });

export { sql, pool };
