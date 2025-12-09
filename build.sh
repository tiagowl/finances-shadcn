#!/bin/bash
set -e

# Find the backend directory
if [ -d "src/backend" ]; then
  cd src/backend
elif [ -d "backend" ]; then
  cd backend
elif [ -f "package.json" ] && [ -f "tsconfig.json" ]; then
  # Already in backend directory
  :
else
  echo "Error: Could not find backend directory"
  ls -la
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build
echo "Building..."
npm run build

