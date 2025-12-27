<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Welcome to TechPlay!</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #0f172a;
            color: white;
            padding: 40px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1e293b, #0f172a);
            border-radius: 16px;
            padding: 40px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            color: #6366f1;
            margin-bottom: 30px;
        }

        h1 {
            color: #f8fafc;
            font-size: 24px;
            margin-bottom: 16px;
        }

        p {
            color: #94a3b8;
            line-height: 1.6;
        }

        .button {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white !important;
            padding: 14px 28px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 20px;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: #64748b;
            font-size: 13px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="logo">🎮 TechPlay</div>
        <h1>Welcome, {{ $userName }}! 👋</h1>
        <p>Thanks for joining TechPlay - your ultimate destination for gaming news, reviews, and community!</p>
        <p>Here's what you can do now:</p>
        <ul style="color: #94a3b8; line-height: 2;">
            <li>📰 Read the latest gaming news and reviews</li>
            <li>💬 Join discussions in our forums</li>
            <li>🏆 Earn XP and climb the ranks</li>
            <li>🛒 Explore our gaming merchandise shop</li>
        </ul>
        <a href="{{ config('app.url') }}" class="button">Start Exploring →</a>
        <div class="footer">
            <p>© {{ date('Y') }} TechPlay. All rights reserved.</p>
        </div>
    </div>
</body>

</html>