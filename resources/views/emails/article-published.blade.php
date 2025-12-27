<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Article Published</title>
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

        .article-box {
            background: rgba(51, 65, 85, 0.5);
            border-radius: 12px;
            padding: 24px;
            margin: 20px 0;
            border-left: 4px solid #6366f1;
        }

        .article-title {
            font-size: 18px;
            color: #f8fafc;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .article-meta {
            font-size: 13px;
            color: #64748b;
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
        <div class="logo">📝 Article Published!</div>
        <h1>Great news, {{ $author->name }}!</h1>
        <p>Your article has been published and is now live on TechPlay.</p>

        <div class="article-box">
            <div class="article-title">{{ $article->title }}</div>
            <div class="article-meta">
                Published: {{ $article->published_at->format('F j, Y g:i A') }}
            </div>
        </div>

        <p>Your article is now visible to all readers. Share it with your audience!</p>

        <a href="{{ config('app.url') }}/articles/{{ $article->slug }}" class="button">View Article →</a>

        <div class="footer">
            <p>Keep up the great work! 🎮</p>
            <p>© {{ date('Y') }} TechPlay. All rights reserved.</p>
        </div>
    </div>
</body>

</html>