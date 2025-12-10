import pool from '../database/db.js';

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM events ORDER BY created_at DESC');
    connection.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM events WHERE id = ?', [id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new event
export const createEvent = async (req, res) => {
  try {
    const { id, title, date, time, location, price, imageUrl, category, type, description, furtherInfo } = req.body;
    const connection = await pool.getConnection();
    
    await connection.query(
      'INSERT INTO events (id, title, date, time, location, price, imageUrl, category, type, description, furtherInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, date, time, location, price, imageUrl, category, type, description, furtherInfo]
    );
    
    const [rows] = await connection.query('SELECT * FROM events WHERE id = ?', [id]);
    connection.release();
    
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, time, location, price, imageUrl, category, type, description, furtherInfo } = req.body;
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      'UPDATE events SET title = ?, date = ?, time = ?, location = ?, price = ?, imageUrl = ?, category = ?, type = ?, description = ?, furtherInfo = ? WHERE id = ?',
      [title, date, time, location, price, imageUrl, category, type, description, furtherInfo, id]
    );
    
    if (result.affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const [rows] = await connection.query('SELECT * FROM events WHERE id = ?', [id]);
    connection.release();
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    const [result] = await connection.query('DELETE FROM events WHERE id = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
