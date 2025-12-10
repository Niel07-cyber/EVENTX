#!/bin/bash

echo "🚀 Setting up EventX Backend..."

# Navigate to backend directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Initialize database
echo "🗄️ Initializing database..."
npm run init-db

echo "✅ Backend setup complete!"
echo ""
echo "To start the backend server, run:"
echo "  cd backend"
echo "  npm run dev"
