#!/bin/bash

# 🚀 Quick Deploy to Production Script
# Run this script to deploy your changes to cPanel

echo "🚀 Starting Quick Deploy Process..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "📝 You have uncommitted changes. Let's commit them first."
    echo ""
    
    # Show current status
    echo "📋 Current status:"
    git status --short
    echo ""
    
    # Ask for commit message
    read -p "💬 Enter commit message (or press Enter for default): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="Deploy updates to production"
    fi
    
    # Add and commit
    echo "📦 Adding files..."
    git add .
    
    echo "💾 Committing changes..."
    git commit -m "$commit_msg"
else
    echo "✅ No uncommitted changes found."
fi

echo ""
echo "🔄 Pushing to GitHub (main branch)..."
git push origin main

# Check if push was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Code pushed to GitHub."
    echo ""
    echo "📊 What happens next:"
    echo "   1. GitHub Actions will start automatically"
    echo "   2. Project will be built for production"
    echo "   3. Built files will be deployed to cPanel"
    echo "   4. Your website will be updated"
    echo ""
    echo "🔗 Check deployment status:"
    echo "   → GitHub Actions: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"
    echo ""
    echo "⏱️  Deployment usually takes 2-5 minutes."
    echo "🌐 Your website: https://shilpgroup.com"
else
    echo ""
    echo "❌ Push failed! Please check the error above."
    exit 1
fi