import pool from '../database/db.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT username, password FROM users WHERE username = ?', [username]);
    connection.release();

    if (rows.length === 0 || rows[0].password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({ success: true, user: { username: rows[0].username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
