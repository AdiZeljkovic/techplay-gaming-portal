#!/bin/bash
# install.sh - Remote Installation Script for TechPlay.gg
# Usage: ./install.sh (Run on Server)

set -e

echo "🚀 Starting Remote Installation..."

# 1. Run Setup Provisioning (Dependencies)
if [ -f "setup.sh" ]; then
    chmod +x setup.sh
    ./setup.sh
fi

echo "📂 Unpacking Files..."

# 2. Backend
if [ -f "backend.zip" ]; then
    rm -rf backend
    unzip -q backend.zip -d backend
    rm backend.zip
    
    # Configure Backend
    cp env.backend backend/.env
    
    echo "🐘 Setting up Backend..."
    cd backend
    composer install --optimize-autoloader --no-dev
    php artisan key:generate
    php artisan storage:link
    
    # Permissions
    chown -R www-data:www-data storage bootstrap/cache
    chmod -R 775 storage bootstrap/cache
    
    # Database
    echo "🗄️ Database Setup..."
    if [ -f "../database.sql" ]; then
        echo "📥 Importing Data from database.sql..."
        # Reset DB to be clean
        sudo -u postgres psql -c "DROP DATABASE IF EXISTS techplay_production;"
        sudo -u postgres psql -c "CREATE DATABASE techplay_production OWNER techplay;"
        # Import
        sudo -u postgres psql techplay_production < ../database.sql
        echo "✅ Data Imported."
    else
        echo "⚠️ No database.sql found. Running standard migrations (Structure Only)..."
        php artisan migrate --force
    fi
    
    cd ..
fi

# 3. Frontend
if [ -f "frontend.zip" ]; then
    rm -rf frontend
    unzip -q frontend.zip -d frontend
    rm frontend.zip
    
    # Configure Frontend
    cp env.frontend frontend/.env.production
    
    echo "⚛️ Building Frontend..."
    cd frontend
    npm ci
    npm run build
    cd ..
fi

# 4. Media
if [ -f "media.zip" ]; then
    echo "🖼️ Restoring Media..."
    mkdir -p backend/storage/app/public
    unzip -q -o media.zip -d backend/storage/app/public
    rm media.zip
fi

# 5. Nginx & Certbot
if [ -f "techplay.conf" ]; then
    echo "🌐 Configuring Nginx..."
    cp techplay.conf /etc/nginx/conf.d/techplay.conf
    nginx -t && systemctl reload nginx
    
    # SSL - Attempt automatic certs if DNS is pointed
    certbot --nginx -d api-beta.techplay.gg -d beta.techplay.gg --non-interactive --agree-tos -m admin@techplay.gg || echo "⚠️ Certbot failed (DNS propogation?). Run manually later."
fi

# 6. PM2 Startup
echo "🔄 Starting Services..."
pm2 delete all || true

# Backend (Octane)
cd backend
pm2 start "php artisan octane:start --server=swoole --port=8000 --host=127.0.0.1" --name api-techplay

# Frontend (Next.js)
cd ../frontend
pm2 start "npm start" --name web-techplay -- -p 3000

pm2 save
pm2 startup | tail -n 1 | bash || true

echo "✅ Installation Complete!"
echo "✨ Frontend: https://beta.techplay.gg"
echo "✨ Backend: https://api-beta.techplay.gg"
