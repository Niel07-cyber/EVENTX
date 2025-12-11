// import pool from '../database/db.js';
// import { sendTicketEmail } from '../services/mailer.js';

// // Get all ticket requests
// export const getAllTicketRequests = async (req, res) => {
//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM ticket_requests ORDER BY timestamp DESC');
//     connection.release();
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get ticket requests by event ID
// export const getTicketRequestsByEvent = async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM ticket_requests WHERE eventId = ? ORDER BY timestamp DESC', [eventId]);
//     connection.release();
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Create new ticket request
// export const createTicketRequest = async (req, res) => {
//   try {
//     const { id, eventId, firstName, lastName, phone, email, gender, agreedToPolicy } = req.body;
//     const connection = await pool.getConnection();

//     await connection.query(
//       'INSERT INTO ticket_requests (id, eventId, firstName, lastName, phone, email, gender, agreedToPolicy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//       [id, eventId, firstName, lastName, phone, email, gender, agreedToPolicy ? 1 : 0]
//     );

//     const [ticketRows] = await connection.query('SELECT * FROM ticket_requests WHERE id = ?', [id]);
//     const ticketRow = ticketRows[0];

//     const [eventRows] = await connection.query('SELECT * FROM events WHERE id = ?', [eventId]);
//     const eventRow = eventRows[0];

//     connection.release();

//     // Send ticket email with QR code
//     try {
//       await sendTicketEmail({ to: email, ticket: ticketRow, event: eventRow });
//     } catch (emailErr) {
//       console.error('Error sending ticket email:', emailErr);
//       return res.status(500).json({ error: 'Ticket created but email failed', details: emailErr.message });
//     }

//     res.status(201).json(ticketRow);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get ticket request count by event ID
// export const getTicketRequestCount = async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT COUNT(*) as count FROM ticket_requests WHERE eventId = ?', [eventId]);
//     connection.release();
//     res.json({ count: rows[0].count });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

import { pool, sql } from "../database/db.js";
import { sendTicketEmail } from "../services/mailer.js";

// Get all ticket requests
export const getAllTicketRequests = async (req, res) => {
  try {
    const request = pool.request();
    // MSSQL: Use result.recordset to get the array of rows
    const result = await request.query(
      "SELECT * FROM ticket_requests ORDER BY timestamp DESC"
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get ticket requests by event ID
export const getTicketRequestsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const request = pool.request();

    // Define input parameters
    request.input("eventId", sql.NVarChar, eventId);

    // Use @eventId instead of ?
    const result = await request.query(
      "SELECT * FROM ticket_requests WHERE eventId = @eventId ORDER BY timestamp DESC"
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new ticket request
export const createTicketRequest = async (req, res) => {
  try {
    const {
      id,
      eventId,
      firstName,
      lastName,
      phone,
      email,
      gender,
      agreedToPolicy,
    } = req.body;

    const request = pool.request();

    // Define all inputs
    request.input("id", sql.NVarChar, id);
    request.input("eventId", sql.NVarChar, eventId);
    request.input("firstName", sql.NVarChar, firstName);
    request.input("lastName", sql.NVarChar, lastName);
    request.input("phone", sql.NVarChar, phone);
    request.input("email", sql.NVarChar, email);
    request.input("gender", sql.NVarChar, gender);
    // Use sql.Bit for boolean values (0 or 1)
    request.input("agreedToPolicy", sql.Bit, agreedToPolicy ? 1 : 0);

    // 1. Insert the ticket
    await request.query(`
      INSERT INTO ticket_requests (id, eventId, firstName, lastName, phone, email, gender, agreedToPolicy) 
      VALUES (@id, @eventId, @firstName, @lastName, @phone, @email, @gender, @agreedToPolicy)
    `);

    // 2. Fetch the newly created ticket details
    // We need a new request object to avoid parameter conflicts if we reused the old one
    const ticketRequest = pool.request();
    ticketRequest.input("id", sql.NVarChar, id);
    const ticketResult = await ticketRequest.query(
      "SELECT * FROM ticket_requests WHERE id = @id"
    );
    const ticketRow = ticketResult.recordset[0];

    // 3. Fetch the event details for the email
    const eventRequest = pool.request();
    eventRequest.input("eventId", sql.NVarChar, eventId);
    const eventResult = await eventRequest.query(
      "SELECT * FROM events WHERE id = @eventId"
    );
    const eventRow = eventResult.recordset[0];

    // Send ticket email with QR code
    try {
      await sendTicketEmail({ to: email, ticket: ticketRow, event: eventRow });
    } catch (emailErr) {
      console.error("Error sending ticket email:", emailErr);
      // We still return 201 because the ticket was saved to DB, just email failed
      return res.status(201).json({
        ...ticketRow,
        message: "Ticket created but email failed to send",
        emailError: emailErr.message,
      });
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
    const request = pool.request();

    request.input("eventId", sql.NVarChar, eventId);

    const result = await request.query(
      "SELECT COUNT(*) as count FROM ticket_requests WHERE eventId = @eventId"
    );

    // MSSQL returns count in the first row
    res.json({ count: result.recordset[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
