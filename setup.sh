#!/bin/bash

# LPC Animation Generator Setup Script
# This script helps set up the development environment

echo "🎮 LPC Animation Generator Setup"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14.0 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
node_version=$(node -v | cut -d'v' -f2)
min_version="14.0.0"

if [ "$(printf '%s\n' "$min_version" "$node_version" | sort -V | head -n1)" != "$min_version" ]; then
    echo "❌ Node.js version $node_version is too old. Please install version 14.0 or higher."
    exit 1
fi

echo "✅ Node.js version $node_version detected"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please ensure npm is installed with Node.js."
    exit 1
fi

echo "✅ npm is available"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please check your internet connection and try again."
    exit 1
fi

echo ""
echo "🚀 Setup complete! You can now start the development server with:"
echo ""
echo "   npm start"
echo ""
echo "The app will open in your browser at http://localhost:3000"
echo ""
echo "📖 For more information, see the README.md file"
echo ""
echo "Happy animating! 🎨"
