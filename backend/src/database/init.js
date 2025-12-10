import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

// Create events table
const createEventsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS events (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      date VARCHAR(50) NOT NULL,
      time VARCHAR(50) NOT NULL,
      location VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL DEFAULT 0,
      imageUrl TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      type VARCHAR(50) DEFAULT 'Onsite',
      description TEXT,
      furtherInfo TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  const connection = await pool.getConnection();
  try {
    await connection.query(sql);
    console.log('✅ Events table created');
  } finally {
    connection.release();
  }
};

// Create users table
const createUsersTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      username VARCHAR(255) PRIMARY KEY,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  const connection = await pool.getConnection();
  try {
    await connection.query(sql);
    console.log('✅ Users table created');
  } finally {
    connection.release();
  }
};

// Create ticket_requests table
const createTicketRequestsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS ticket_requests (
      id VARCHAR(255) PRIMARY KEY,
      eventId VARCHAR(255) NOT NULL,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL,
      gender VARCHAR(50) NOT NULL,
      agreedToPolicy TINYINT(1) NOT NULL DEFAULT 1,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
    )
  `;
  const connection = await pool.getConnection();
  try {
    await connection.query(sql);
    console.log('✅ Ticket requests table created');
  } finally {
    connection.release();
  }
};

// Seed initial events data
const seedEvents = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM events');
    
    if (rows[0].count > 0) {
      console.log('ℹ️  Database already has data, skipping seed');
      return;
    }

    const events = [
      {
        id: '1',
        title: 'Global Citizen Festival',
        date: 'Sat, Sep 23',
        time: '4:00 PM',
        location: 'Central Park, NYC',
        price: 0,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI6RYohPi03Nr5dN7msqgdzzaScX67Xkjj4Qd5YzfCyV-QGOQk5eSlbM1dOj8I39mkGBO4KT3TjGM0QFMZCRBlu-7q4BdleURY-ZuVOvKEc1F8M6i_7srSp12Z1mcv62CSBtrAVFtHJUnAkUG4TfHwHz6ehDaVDh8nsIqqPc_Yb5g3u2qV6IC_1_KKMTj2I1GC2A1YBpvoHSMr0JKFl8lXsXZZuAQudPm9YkymANpi6kUGZAWpqzJUbsCUPrA_DnYcxU2qPqW7V3g',
        category: 'Music',
        type: 'Onsite',
        description: 'Join us for a day of music and activism to end extreme poverty.',
        furtherInfo: 'Gates open at 2:00 PM. No outside food or drinks allowed.'
      },
      {
        id: '2',
        title: 'Summer Music Bash',
        date: 'Sat, Sep 23',
        time: '6:00 PM',
        location: 'Central Park, NYC',
        price: 0,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4-FcB7eVZO3RhMpKDyeGnOQ1CVEolILp9JSGvLCKq1zIlEuqiowng1-LJNbLbPU0XzqUz-3htbibJc5wlmpJGslrJn66iE8gvTouECqVYCjd0N8uP_Qw_ge4WsPbiUnwsJEDlcHvxkD_rlmn3FgAa84AlvrbUNWpcz6xWuodVva0hnQ3j1DiurFl-3vdzrdQWXJow7tna8XC0VzWvngxHBnbBBpdBwo_NpawXexO5hjZN_hu-HfhyLWSY9AUiaZIJ4vFe2MJyBFg',
        category: 'Music',
        type: 'Onsite',
        description: 'A vibrant celebration of summer hits featuring local and international artists.',
        furtherInfo: 'This is a standing event. Accessible viewing areas are available.'
      },
      {
        id: '3',
        title: 'Neon Lights Festival',
        date: 'Sat, Sep 23',
        time: '8:00 PM',
        location: 'Downtown District',
        price: 0,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw3vgaaLI9-NvENl0GRCxhq92bnqPq2OGh1yLKHfDhL81ytCvBvtWdWp4rug2EaoLQpha86pXrHBrM9kpzMKThoexCPRewcmxD_eU7A6TikmOfKBXEmQs7HO96ojISJy0dlOppmAQecvfD6pGd7lgrzt-5ugr64yx4l_njssYT8-t3oVa87tIzf614hUhxaXbEkMCMOE7cDjo1ORpIhUJ_7B3eq1p7OJ5LTTfgkbPSRNN5b8We4YfJyVJRFF_bHQecWhimr0OTHn8',
        category: 'Festivals',
        type: 'Onsite',
        description: 'Experience the city glowing with art installations, light shows, and live performances.',
        furtherInfo: 'Family friendly until 9 PM.'
      }
    ];

    for (const event of events) {
      await connection.query(
        'INSERT INTO events (id, title, date, time, location, price, imageUrl, category, type, description, furtherInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [event.id, event.title, event.date, event.time, event.location, event.price, event.imageUrl, event.category, event.type, event.description, event.furtherInfo]
      );
    }
    console.log(`✅ Seeded ${events.length} events`);
  } finally {
    connection.release();
  }
};

// Seed default admin user
const seedAdminUser = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
    
    if (rows[0].count > 0) {
      console.log('ℹ️  Users table already has data, skipping admin seed');
      return;
    }

    await connection.query('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', 'admin']);
    console.log('✅ Seeded default admin user (admin/admin)');
  } finally {
    connection.release();
  }
};

// Initialize database
const initDatabase = async () => {
  try {
    console.log('🚀 Initializing database...');
    await createUsersTable();
    await createEventsTable();
    await createTicketRequestsTable();
    await seedEvents();
    await seedAdminUser();
    console.log('✅ Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

// Run initialization
initDatabase();

export { initDatabase };
