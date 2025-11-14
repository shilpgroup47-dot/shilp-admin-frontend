#!/bin/bash

# cPanel Deployment Script for Shilp Admin Frontend
# This script builds the project and prepares it for cPanel deployment

echo "🚀 Starting cPanel deployment process..."

# Check if Node.js and npm are available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🔨 Building project for production..."
npm run build:prod

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful! Files ready for cPanel deployment."
    echo "📁 Built files are in the 'dist' directory"
    echo ""
    echo "📋 Next steps:"
    echo "1. Upload the 'dist' folder contents to your cPanel public_html directory"
    echo "2. Make sure .htaccess file is included"
    echo "3. Set up environment variables in cPanel"
    echo ""
    echo "🌐 Your built application is ready to deploy!"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi