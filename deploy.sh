#!/bin/bash

# InvoiceThai - Vercel Deployment Script
# This script helps deploy the application to Vercel

set -e

echo "🚀 InvoiceThai - Vercel Deployment Script"
echo "=========================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

echo ""
echo "📋 Before deployment, make sure you have:"
echo "   1. Your Supabase anon key ready"
echo "   2. Database schema initialized in Supabase"
echo ""

read -p "Do you have your Supabase anon key? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📖 To get your Supabase anon key:"
    echo "   1. Visit: https://supabase.com/dashboard/project/vtcpvvzlxpqwmnjvvldv/settings/api"
    echo "   2. Copy the 'anon/public' key"
    echo ""
    echo "Run this script again when you have the key."
    exit 1
fi

echo ""
echo "🔧 Environment Variables Setup"
echo "You'll need to set these in Vercel:"
echo ""
echo "NEXT_PUBLIC_SUPABASE_URL=https://vtcpvvzlxpqwmnjvvldv.supabase.co"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key-here>"
echo ""

read -p "Ready to deploy to production? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Deploying to Vercel..."
    vercel --prod

    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Visit your Vercel dashboard to see the deployment"
    echo "   2. Test the application at your Vercel URL"
    echo "   3. Verify all features work correctly"
    echo ""
else
    echo ""
    echo "Deployment cancelled."
    echo "Run this script again when ready to deploy."
fi
