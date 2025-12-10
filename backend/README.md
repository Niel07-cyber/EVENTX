# EventX Backend

Backend API for the EventX event management platform built with Express.js and SQLite.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize the database:
```bash
npm run init-db
```

3. Start the development server:
```bash
npm run dev
```

The server will run on http://localhost:3001

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Ticket Requests
- `GET /api/tickets` - Get all ticket requests
- `GET /api/tickets/event/:eventId` - Get ticket requests by event
- `GET /api/tickets/event/:eventId/count` - Get ticket request count
- `POST /api/tickets` - Create new ticket request

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=3001
NODE_ENV=development
DATABASE_PATH=./src/database/eventx.db
FRONTEND_URL=http://localhost:5173
```
