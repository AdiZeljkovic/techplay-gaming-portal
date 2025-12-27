#!/bin/bash
# install-git.sh - Git-Based Deployment for TechPlay.gg
# Run on Server

set -e

# Configuration
APP_DIR="/var/www/techplay"
REPO_URL="$1" # Pass repo URL as first argument

if [ -z "$REPO_URL" ]; then
    echo "❌ Error: Please provide your GitHub Repository URL."
    echo "Usage: ./install-git.sh https://github.com/username/repo.git"
    exit 1
fi

echo "🚀 Starting Git Deployment..."

# 1. Provision Server (if not done)
if [ -f "setup.sh" ]; then
    chmod +x setup.sh
    ./setup.sh
fi

# 2. Clone/Pull Repository
if [ -d "$APP_DIR/.git" ]; then
    echo "🔄 Updating existing repository..."
    cd $APP_DIR
    git pull origin main
else
    echo "📥 Cloning repository..."
    rm -rf $APP_DIR
    git clone "$REPO_URL" $APP_DIR
    cd $APP_DIR
fi

# 3. Backend Setup
echo "🐘 Setting up Backend..."
cp ../env.backend .env
composer install --optimize-autoloader --no-dev
php artisan key:generate
php artisan storage:link
php artisan migrate --force

# Permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# 4. Frontend Setup
echo "⚛️ Building Frontend..."
cd frontend-next
cp ../../env.frontend .env.production
npm ci
npm run build
cd ..

# 5. Media (Restore if exists)
if [ -f "../media.zip" ]; then
    echo "🖼️ Restoring Media..."
    unzip -q -o ../media.zip -d storage/app/public
fi

# 6. Database Import (if exists)
if [ -f "../database.sql" ]; then
    echo "🗄️ Importing Database..."
    sudo -u postgres psql techplay_production < ../database.sql
    mv ../database.sql ../database.sql.bak # Rename so we don't import again
fi

# 7. Nginx & Certbot
echo "🌐 Configuring Nginx..."
cp ../nginx/techplay.conf /etc/nginx/conf.d/techplay.conf
nginx -t && systemctl reload nginx
certbot --nginx -d api-beta.techplay.gg -d beta.techplay.gg --non-interactive --agree-tos -m admin@techplay.gg || true

# 8. PM2 Restart
echo "🔄 Restarting Services..."
pm2 delete all || true
pm2 start "php artisan octane:start --server=swoole --port=8000 --host=127.0.0.1" --name api-techplay
cd frontend-next
pm2 start "npm start" --name web-techplay -- -p 3000
pm2 save

echo "✅ Deployment Complete!"
