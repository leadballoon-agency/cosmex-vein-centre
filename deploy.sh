#!/bin/bash

echo "🚀 Cosmex Vein AI - Quick Deployment Script"
echo "==========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js detected: $(node -v)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Deploy to Vercel
echo ""
echo "📍 Deploying to Vercel..."
echo "------------------------"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm i -g vercel
fi

echo ""
echo "🎯 Starting Vercel deployment..."
echo ""
echo "Follow these steps:"
echo "1. Set up and deploy? → Yes"
echo "2. Which scope? → Select your account"
echo "3. Link to existing project? → No"
echo "4. Project name? → cosmex-vein-ai (or press enter)"
echo "5. Directory? → ./ (press enter)"
echo "6. Build settings? → No (press enter)"
echo ""

vercel

echo ""
echo "✨ Deployment complete!"
echo ""
echo "⚠️  IMPORTANT: Add your API keys in Vercel Dashboard:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click on your project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add these variables:"
echo "   - CLAUDE_API_KEY = your-claude-key"
echo "   - OPENAI_API_KEY = your-openai-key"
echo ""
echo "Your app will be live at the URL shown above! 🎉"