#!/bin/bash

# 🚀 Vercel Deployment Verification Script
# Run this after deploying to check for common issues

echo "🔍 Checking Vercel Deployment Configuration..."
echo "=============================================="

# Check if we're in the client directory
if [ ! -f "package.json" ] || [ ! -f "vercel.json" ]; then
    echo "❌ Please run this script from the client directory"
    exit 1
fi

echo "✅ Found package.json and vercel.json"

# Check vercel.json syntax
echo ""
echo "🔧 Checking vercel.json configuration..."
if command -v node &> /dev/null; then
    node -e "try { JSON.parse(require('fs').readFileSync('vercel.json', 'utf8')); console.log('✅ vercel.json is valid JSON'); } catch(e) { console.log('❌ vercel.json has invalid JSON:', e.message); process.exit(1); }"
else
    echo "⚠️ Node.js not found, skipping JSON validation"
fi

# Check build output
echo ""
echo "📦 Checking build output..."
if [ -d "dist" ]; then
    echo "✅ dist/ directory exists"

    if [ -f "dist/index.html" ]; then
        echo "✅ dist/index.html exists"

        # Check if index.html contains the correct script tags
        if grep -q "type=\"module\"" dist/index.html; then
            echo "✅ Module scripts found in index.html"
        else
            echo "❌ No module scripts found in index.html"
        fi

        # Check for asset references
        if grep -q "assets/" dist/index.html; then
            echo "✅ Asset references found in index.html"
        else
            echo "❌ No asset references found in index.html"
        fi
    else
        echo "❌ dist/index.html not found"
    fi
else
    echo "❌ dist/ directory not found - run 'npm run build' first"
fi

# Check environment variables
echo ""
echo "🔐 Checking environment variables..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"

    if grep -q "VITE_API_URL" .env; then
        echo "✅ VITE_API_URL found in .env"
    else
        echo "❌ VITE_API_URL not found in .env"
    fi

    if grep -q "VITE_CURRENCY" .env; then
        echo "✅ VITE_CURRENCY found in .env"
    else
        echo "❌ VITE_CURRENCY not found in .env"
    fi
else
    echo "❌ .env file not found"
fi

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo "1. ✅ Vercel account created"
echo "2. ✅ GitHub repository connected"
echo "3. ✅ Root directory set to 'client'"
echo "4. ✅ Build command: 'npm run build'"
echo "5. ✅ Output directory: 'dist'"
echo "6. ✅ Environment variables set in Vercel dashboard:"
echo "   - VITE_API_URL=https://your-backend-url.onrender.com"
echo "   - VITE_CURRENCY=₹"
echo "   - VITE_RAZORPAY_KEY_ID=your_razorpay_key"
echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "To deploy: Run 'vercel --prod' in the client directory"
echo "Or push to GitHub to trigger automatic deployment"