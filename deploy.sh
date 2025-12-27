#!/bin/bash
# ============================================
# TechPlay Production Deployment Script
# ============================================

set -e

echo "🚀 Starting TechPlay Deployment..."

# ==== 1. Pull Latest Code ====
echo "📥 Pulling latest code..."
git pull origin main

# ==== 2. Install Dependencies ====
echo "📦 Installing Composer dependencies..."
composer install --optimize-autoloader --no-dev

# ==== 3. Build Frontend Assets ====
echo "🔧 Building frontend assets..."
npm install --legacy-peer-deps
npm run build

# ==== 4. Laravel Optimizations ====
echo "⚡ Running Laravel optimizations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
php artisan optimize

# ==== 5. Database Migrations ====
echo "📊 Running database migrations..."
php artisan migrate --force

# ==== 6. Storage Link ====
php artisan storage:link 2>/dev/null || true

# ==== 7. Clear Old Cache ====
php artisan cache:clear

# ==== 8. Queue Restart (if using queue workers) ====
php artisan queue:restart 2>/dev/null || true

# ==== 9. OpCache Reset (if available) ====
if command -v cachetool &> /dev/null; then
    echo "🔄 Resetting OpCache..."
    cachetool opcache:reset
fi

echo "✅ Deployment complete!"
echo ""
echo "📋 Post-Deployment Checklist:"
echo "  - Verify APP_DEBUG=false in .env"
echo "  - Check OpCache is enabled: php -i | grep opcache.enable"
echo "  - Run 'php artisan about' to verify configuration"
