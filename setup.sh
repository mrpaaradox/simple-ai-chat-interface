#!/bin/bash

# AI Chatty Setup Script 🤖
# This script automates the environment configuration and dependency installation.

# Exit immediately if a command exits with a non-zero status
set -e

echo "------------------------------------------"
echo "🚀 Welcome to AI Chatty Setup"
echo "------------------------------------------"

# 1. Ask for GROQ_API_KEY
echo "Please paste your GROQ_API_KEY:"
read -r groq_key

if [ -z "$groq_key" ]; then
    echo "❌ Error: GROQ_API_KEY cannot be empty."
    exit 1
fi

# 2. Create or update .env file
echo "📝 Configuring environment variables..."
if [ -f .env ]; then
    # Check if GROQ_API_KEY already exists
    if grep -q "GROQ_API_KEY=" .env; then
        # Replace existing key
        sed -i '' "s|GROQ_API_KEY=.*|GROQ_API_KEY=$groq_key|" .env
    else
        # Append new key
        echo "GROQ_API_KEY=$groq_key" >> .env
    fi
else
    # Create new .env file
    echo "GROQ_API_KEY=$groq_key" > .env
fi

echo "✅ .env file configured."

# 3. Install dependencies
echo "📦 Installing dependencies (npm install)..."
npm install

echo "------------------------------------------"
echo "✨ Setup Complete!"
echo "🚀 Starting the application..."
echo "------------------------------------------"

# 4. Start the application
npm run dev
