import pool from '../database/db.js';
import { sendTicketEmail } from '../services/mailer.js';

// Get all ticket requests
export const getAllTicketRequests = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM ticket_requests ORDER BY timestamp DESC');
    connection.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get ticket requests by event ID
export const getTicketRequestsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM ticket_requests WHERE eventId = ? ORDER BY timestamp DESC', [eventId]);
    connection.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new ticket request
export const createTicketRequest = async (req, res) => {
  try {
    const { id, eventId, firstName, lastName, phone, email, gender, agreedToPolicy } = req.body;
    const connection = await pool.getConnection();
    
    await connection.query(
      'INSERT INTO ticket_requests (id, eventId, firstName, lastName, phone, email, gender, agreedToPolicy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, eventId, firstName, lastName, phone, email, gender, agreedToPolicy ? 1 : 0]
    );
    
    const [ticketRows] = await connection.query('SELECT * FROM ticket_requests WHERE id = ?', [id]);
    const ticketRow = ticketRows[0];
    
    const [eventRows] = await connection.query('SELECT * FROM events WHERE id = ?', [eventId]);
    const eventRow = eventRows[0];
    
    connection.release();

    // Send ticket email with QR code
    try {
      await sendTicketEmail({ to: email, ticket: ticketRow, event: eventRow });
    } catch (emailErr) {
      console.error('Error sending ticket email:', emailErr);
      return res.status(500).json({ error: 'Ticket created but email failed', details: emailErr.message });
    }

    res.status(201).json(ticketRow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get ticket request count by event ID
export const getTicketRequestCount = async (req, res) => {
  try {
    const { eventId } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM ticket_requests WHERE eventId = ?', [eventId]);
    connection.release();
    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
