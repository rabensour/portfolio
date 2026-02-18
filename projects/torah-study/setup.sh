#!/bin/bash
# Setup script for Torah Study App

set -e

echo "🕎 Torah Study App - Setup"
echo "=========================="

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 is required but not installed. Aborting." >&2; exit 1; }
command -v psql >/dev/null 2>&1 || { echo "❌ PostgreSQL is required but not installed. Aborting." >&2; exit 1; }

echo "✅ Prerequisites check passed"

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your database credentials"
fi

cd ..

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

cd ..

# Database setup prompt
echo ""
echo "📊 Database Setup"
echo "================="
echo ""
echo "To set up the database, run:"
echo ""
echo "  sudo -u postgres psql"
echo ""
echo "Then execute:"
echo ""
echo "  CREATE DATABASE torah_study;"
echo "  CREATE USER torah_user WITH PASSWORD 'your_secure_password';"
echo "  GRANT ALL PRIVILEGES ON DATABASE torah_study TO torah_user;"
echo "  \\q"
echo ""
echo "Finally, apply the schema:"
echo ""
echo "  psql -U torah_user -d torah_study -f database/schema.sql"
echo ""

# Final instructions
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo ""
echo "1. Configure backend/.env with your database URL"
echo "2. Setup the database (see instructions above)"
echo "3. Start the backend:"
echo "   cd backend && source venv/bin/activate && python -m api.main"
echo ""
echo "4. Start the frontend (in another terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "5. Open http://localhost:5173 in your browser"
echo ""
echo "📖 For more information, see README.md"
