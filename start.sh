#!/bin/bash

# Start Full Stack Application

echo "Starting Product Data Explorer..."
echo ""

# Start backend
echo "🚀 Starting backend on http://localhost:3001..."
cd backend
npm run start:dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "🎨 Starting frontend on http://localhost:3000..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers started!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:3001"
echo "📍 API Docs: http://localhost:3001/api/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
