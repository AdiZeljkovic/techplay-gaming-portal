<?php

namespace App\Mail;

use App\Models\Article;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ArticlePublished extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Article $article
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Article Has Been Published! 📝',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.article-published',
            with: [
                'article' => $this->article,
                'author' => $this->article->author,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
