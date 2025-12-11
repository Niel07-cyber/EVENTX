import { pool, sql } from "../database/db.js";

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    // MSSQL: Request directly from pool, no manual connection management needed
    const request = pool.request();
    const result = await request.query(
      "SELECT * FROM events ORDER BY created_at DESC"
    );

    // MSSQL returns data in result.recordset
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = pool.request();

    // MSSQL: Must define input parameters
    request.input("id", sql.NVarChar, id);

    // MSSQL: Use @id instead of ?
    const result = await request.query("SELECT * FROM events WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new event
export const createEvent = async (req, res) => {
  try {
    const {
      id,
      title,
      date,
      time,
      location,
      price,
      imageUrl,
      category,
      type,
      description,
      furtherInfo,
    } = req.body;

    const request = pool.request();

    // Define all inputs with their SQL types
    request.input("id", sql.NVarChar, id);
    request.input("title", sql.NVarChar, title);
    request.input("date", sql.NVarChar, date);
    request.input("time", sql.NVarChar, time);
    request.input("location", sql.NVarChar, location);
    request.input("price", sql.Decimal(10, 2), price);
    request.input("imageUrl", sql.NVarChar, imageUrl);
    request.input("category", sql.NVarChar, category);
    request.input("type", sql.NVarChar, type);
    request.input("description", sql.NVarChar, description);
    request.input("furtherInfo", sql.NVarChar, furtherInfo);

    // Use @parameters in the query
    await request.query(`
      INSERT INTO events (id, title, date, time, location, price, imageUrl, category, type, description, furtherInfo) 
      VALUES (@id, @title, @date, @time, @location, @price, @imageUrl, @category, @type, @description, @furtherInfo)
    `);

    // Fetch the created event to return it
    // Note: Re-using request object usually clears parameters, safest to make a new request or re-declare
    const fetchRequest = pool.request();
    fetchRequest.input("id", sql.NVarChar, id);
    const result = await fetchRequest.query(
      "SELECT * FROM events WHERE id = @id"
    );

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      date,
      time,
      location,
      price,
      imageUrl,
      category,
      type,
      description,
      furtherInfo,
    } = req.body;

    const request = pool.request();

    request.input("id", sql.NVarChar, id);
    request.input("title", sql.NVarChar, title);
    request.input("date", sql.NVarChar, date);
    request.input("time", sql.NVarChar, time);
    request.input("location", sql.NVarChar, location);
    request.input("price", sql.Decimal(10, 2), price);
    request.input("imageUrl", sql.NVarChar, imageUrl);
    request.input("category", sql.NVarChar, category);
    request.input("type", sql.NVarChar, type);
    request.input("description", sql.NVarChar, description);
    request.input("furtherInfo", sql.NVarChar, furtherInfo);

    const result = await request.query(`
      UPDATE events 
      SET title = @title, date = @date, time = @time, location = @location, 
          price = @price, imageUrl = @imageUrl, category = @category, 
          type = @type, description = @description, furtherInfo = @furtherInfo 
      WHERE id = @id
    `);

    // rowsAffected returns an array in MSSQL
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const fetchRequest = pool.request();
    fetchRequest.input("id", sql.NVarChar, id);
    const updated = await fetchRequest.query(
      "SELECT * FROM events WHERE id = @id"
    );

    res.json(updated.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const request = pool.request();

    request.input("id", sql.NVarChar, id);
    const result = await request.query("DELETE FROM events WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
