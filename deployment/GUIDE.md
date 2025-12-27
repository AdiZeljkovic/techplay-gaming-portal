# 🚀 TechPlay.gg "Speed of Light" Deployment Guide (Automated)

**Target Server:** `46.224.110.57` (Hetzner Arm64)

I have automated the entire process into two scripts.

---

## Step 1: Local (Windows)

Run the **Deploy Script** in PowerShell. This will zip your backend, frontend, and media, then upload everything to the server.

```powershell
.\deployment\deploy.ps1
```

*(You will be asked for the server root password).*

---

## Step 2: Remote (Server)

SSH into the server and run the **Install Script**.

```bash
ssh root@46.224.110.57
cd /var/www/techplay
chmod +x install.sh
./install.sh
```

---

**That's it!** The script will:
1. Install all dependencies (PHP 8.3, Node 20, Postgres 16).
2. Unpack your code.
3. install `composer` and `npm` packages.
4. Build the frontend.
5. Migrate the database.
6. Configure Nginx and SSL.
7. Start everything with PM2.

**Manual Database Import (Optional):**
If you have a SQL dump (`techplay_full.sql`), upload it separately and run:
```bash
sudo -u postgres psql techplay_production < techplay_full.sql
```
