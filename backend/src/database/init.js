// server/init.js
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { sql, pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

// 1. Create Events Table
const createEventsTable = async () => {
  const tableCheckSql = `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='events' and xtype='U')
    CREATE TABLE events (
      id NVARCHAR(255) PRIMARY KEY,
      title NVARCHAR(255) NOT NULL,
      date NVARCHAR(50) NOT NULL,
      time NVARCHAR(50) NOT NULL,
      location NVARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL DEFAULT 0,
      imageUrl NVARCHAR(MAX) NOT NULL,
      category NVARCHAR(100) NOT NULL,
      type NVARCHAR(50) DEFAULT 'Onsite',
      description NVARCHAR(MAX),
      furtherInfo NVARCHAR(MAX),
      created_at DATETIME DEFAULT GETDATE()
    )
  `;

  try {
    const request = pool.request();
    await request.query(tableCheckSql);
    console.log("✅ Events table checked/created");
  } catch (err) {
    console.error("❌ Error creating events table:", err);
    throw err;
  }
};

// 2. Create Users Table
const createUsersTable = async () => {
  const sql = `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' and xtype='U')
    CREATE TABLE users (
      username NVARCHAR(255) PRIMARY KEY,
      password NVARCHAR(255) NOT NULL,
      created_at DATETIME DEFAULT GETDATE()
    )
  `;
  try {
    const request = pool.request();
    await request.query(sql);
    console.log("✅ Users table checked/created");
  } catch (err) {
    console.error("❌ Error creating users table:", err);
    throw err;
  }
};

// 3. Create Ticket Requests Table
const createTicketRequestsTable = async () => {
  const sql = `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ticket_requests' and xtype='U')
    CREATE TABLE ticket_requests (
      id NVARCHAR(255) PRIMARY KEY,
      eventId NVARCHAR(255) NOT NULL,
      firstName NVARCHAR(255) NOT NULL,
      lastName NVARCHAR(255) NOT NULL,
      phone NVARCHAR(20) NOT NULL,
      email NVARCHAR(255) NOT NULL,
      gender NVARCHAR(50) NOT NULL,
      agreedToPolicy BIT NOT NULL DEFAULT 1,
      timestamp DATETIME DEFAULT GETDATE(),
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
    )
  `;
  try {
    const request = pool.request();
    await request.query(sql);
    console.log("✅ Ticket requests table checked/created");
  } catch (err) {
    console.error("❌ Error creating tickets table:", err);
    throw err;
  }
};

// 4. Seed Events
const seedEvents = async () => {
  try {
    const request = pool.request();
    const result = await request.query("SELECT COUNT(*) as count FROM events");

    if (result.recordset[0].count > 0) {
      console.log("ℹ️  Database already has data, skipping seed");
      return;
    }

    const events = [
      {
        id: "1",
        title: "Global Citizen Festival",
        date: "Sat, Sep 23",
        time: "4:00 PM",
        location: "Central Park, NYC",
        price: 0,
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDI6RYohPi03Nr5dN7msqgdzzaScX67Xkjj4Qd5YzfCyV-QGOQk5eSlbM1dOj8I39mkGBO4KT3TjGM0QFMZCRBlu-7q4BdleURY-ZuVOvKEc1F8M6i_7srSp12Z1mcv62CSBtrAVFtHJUnAkUG4TfHwHz6ehDaVDh8nsIqqPc_Yb5g3u2qV6IC_1_KKMTj2I1GC2A1YBpvoHSMr0JKFl8lXsXZZuAQudPm9YkymANpi6kUGZAWpqzJUbsCUPrA_DnYcxU2qPqW7V3g",
        category: "Music",
        type: "Onsite",
        description:
          "Join us for a day of music and activism to end extreme poverty.",
        furtherInfo:
          "Gates open at 2:00 PM. No outside food or drinks allowed.",
      },
      {
        id: "2",
        title: "Summer Music Bash",
        date: "Sat, Sep 23",
        time: "6:00 PM",
        location: "Central Park, NYC",
        price: 0,
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuD4-FcB7eVZO3RhMpKDyeGnOQ1CVEolILp9JSGvLCKq1zIlEuqiowng1-LJNbLbPU0XzqUz-3htbibJc5wlmpJGslrJn66iE8gvTouECqVYCjd0N8uP_Qw_ge4WsPbiUnwsJEDlcHvxkD_rlmn3FgAa84AlvrbUNWpcz6xWuodVva0hnQ3j1DiurFl-3vdzrdQWXJow7tna8XC0VzWvngxHBnbBBpdBwo_NpawXexO5hjZN_hu-HfhyLWSY9AUiaZIJ4vFe2MJyBFg",
        category: "Music",
        type: "Onsite",
        description:
          "A vibrant celebration of summer hits featuring local and international artists.",
        furtherInfo:
          "This is a standing event. Accessible viewing areas are available.",
      },
      {
        id: "3",
        title: "Neon Lights Festival",
        date: "Sat, Sep 23",
        time: "8:00 PM",
        location: "Downtown District",
        price: 0,
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDw3vgaaLI9-NvENl0GRCxhq92bnqPq2OGh1yLKHfDhL81ytCvBvtWdWp4rug2EaoLQpha86pXrHBrM9kpzMKThoexCPRewcmxD_eU7A6TikmOfKBXEmQs7HO96ojISJy0dlOppmAQecvfD6pGd7lgrzt-5ugr64yx4l_njssYT8-t3oVa87tIzf614hUhxaXbEkMCMOE7cDjo1ORpIhUJ_7B3eq1p7OJ5LTTfgkbPSRNN5b8We4YfJyVJRFF_bHQecWhimr0OTHn8",
        category: "Festivals",
        type: "Onsite",
        description:
          "Experience the city glowing with art installations, light shows, and live performances.",
        furtherInfo: "Family friendly until 9 PM.",
      },
    ];

    for (const event of events) {
      const insertReq = pool.request();
      insertReq.input("id", sql.NVarChar, event.id);
      insertReq.input("title", sql.NVarChar, event.title);
      insertReq.input("date", sql.NVarChar, event.date);
      insertReq.input("time", sql.NVarChar, event.time);
      insertReq.input("location", sql.NVarChar, event.location);
      insertReq.input("price", sql.Decimal(10, 2), event.price);
      insertReq.input("imageUrl", sql.NVarChar, event.imageUrl);
      insertReq.input("category", sql.NVarChar, event.category);
      insertReq.input("type", sql.NVarChar, event.type);
      insertReq.input("description", sql.NVarChar, event.description);
      insertReq.input("furtherInfo", sql.NVarChar, event.furtherInfo);

      await insertReq.query(`
        INSERT INTO events (id, title, date, time, location, price, imageUrl, category, type, description, furtherInfo)
        VALUES (@id, @title, @date, @time, @location, @price, @imageUrl, @category, @type, @description, @furtherInfo)
      `);
    }
    console.log(`✅ Seeded ${events.length} events`);
  } catch (err) {
    console.error("❌ Error seeding events:", err);
  }
};

// 5. Seed Admin User
const seedAdminUser = async () => {
  try {
    const request = pool.request();
    const result = await request.query("SELECT COUNT(*) as count FROM users");

    if (result.recordset[0].count > 0) {
      console.log("ℹ️  Users table already has data, skipping admin seed");
      return;
    }

    const users = [
      { username: "admin", password: "admin" },
      { username: "user1", password: "password123" },
      { username: "user2", password: "password123" },
      { username: "organizer", password: "organizer123" },
    ];

    for (const user of users) {
      const insertReq = pool.request();
      insertReq.input("u", sql.NVarChar, user.username);
      insertReq.input("p", sql.NVarChar, user.password);

      await insertReq.query(
        "INSERT INTO users (username, password) VALUES (@u, @p)"
      );
    }
    console.log(`✅ Seeded ${users.length} users`);
  } catch (err) {
    console.error("❌ Error seeding users:", err);
  }
};

// Main Initialization
const initDatabase = async () => {
  try {
    console.log("🚀 Initializing MSSQL database...");

    // Ensure pool is connected before querying
    if (!pool.connected) {
      await pool.connect();
    }

    await createUsersTable();
    await createEventsTable();
    await createTicketRequestsTable();
    await seedEvents();
    await seedAdminUser();

    console.log("✅ Database initialized successfully!");
    pool.close(); // Close connection so script exits
    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    pool.close();
    process.exit(1);
  }
};

initDatabase();

export { initDatabase };
