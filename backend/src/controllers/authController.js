// import pool from '../database/db.js';

// export const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ error: 'Username and password are required' });
//     }

//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT username, password FROM users WHERE username = ?', [username]);
//     connection.release();

//     if (rows.length === 0 || rows[0].password !== password) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     return res.json({ success: true, user: { username: rows[0].username } });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

import { pool, sql } from "../database/db.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // MSSQL: Use pool.request() directly
    const request = pool.request();

    // Define input parameters
    request.input("username", sql.NVarChar, username);

    // Use @username parameter in query
    const result = await request.query(
      "SELECT username, password FROM users WHERE username = @username"
    );

    // MSSQL: Check recordset length
    if (
      result.recordset.length === 0 ||
      result.recordset[0].password !== password
    ) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Login success
    return res.json({
      success: true,
      user: { username: result.recordset[0].username },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
