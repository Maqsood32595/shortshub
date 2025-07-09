
#!/bin/bash

echo "🚀 Starting ShortsHub application..."

# Install dependencies if needed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

# Run database migrations
echo "🗄️ Running database migrations..."
cd server && npm run migrate 2>/dev/null || echo "⚠️  Database migration skipped (DB not available)"

# Build the application
echo "🔨 Building application..."
cd server && npm run build

# Start the server
echo "🌟 Starting server..."
npm start
