#!/bin/bash

# TechPlay.gg Server Setup Script (Ubuntu 22.04/24.04 ARM64)
# Run as root!

set -e

echo "🚀 Starting TechPlay Server Setup..."

# 1. Update & Essentials
apt-get update
apt-get install -y curl git zip unzip software-properties-common libpng-dev libonig-dev libxml2-dev

# 2. Add Repositories
# PHP
add-apt-repository -y ppa:ondrej/php
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
# PostgreSQL
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

apt-get update

# 3. Install PHP 8.3 & Extensions (including Swoole for Octane)
echo "🐘 Installing PHP 8.3..."
apt-get install -y php8.3 php8.3-cli php8.3-fpm php8.3-common php8.3-mysql php8.3-zip php8.3-gd php8.3-mbstring php8.3-curl php8.3-xml php8.3-bcmath php8.3-pgsql php8.3-redis php8.3-swoole php8.3-intl

# 4. Install Node.js, Nginx, Certbot
echo "📦 Installing Node.js, Nginx, Certbot..."
apt-get install -y nodejs nginx certbot python3-certbot-nginx

# 5. Install PM2
echo "📈 Installing PM2..."
npm install -g pm2

# 6. Install PostgreSQL 16
echo "🐘 Installing PostgreSQL 16..."
apt-get install -y postgresql-16 postgresql-client-16

# 7. Configure PostgreSQL
echo "🗄️ Configuring Database..."
# Switch to postgres user and run SQL commands
sudo -u postgres psql -c "CREATE USER techplay WITH PASSWORD 'admin';" || true
sudo -u postgres psql -c "CREATE DATABASE techplay_production OWNER techplay;" || true
sudo -u postgres psql -c "ALTER USER techplay CREATEDB;" || true

# 8. Install Composer
echo "🎼 Installing Composer..."
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# 9. Setup Directory Permissions
echo "📂 Setting up /var/www/techplay..."
mkdir -p /var/www/techplay
chown -R www-data:www-data /var/www/techplay
chmod -R 775 /var/www/techplay

# 10. Install Redis
echo "⚡ Installing Redis..."
apt-get install -y redis-server
systemctl enable redis-server
systemctl start redis-server

echo "✅ Server Setup Complete! Ready for deployment."
echo "👉 Don't forget to update the database password in your .env file!"
