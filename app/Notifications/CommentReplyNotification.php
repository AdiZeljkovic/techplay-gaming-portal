<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

use App\Models\Comment;
use Illuminate\Support\Str;

class CommentReplyNotification extends Notification
{
    use Queueable;

    public function __construct(public Comment $comment)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $commentable = $this->comment->commentable;
        $link = '/';

        // Determine link based on commentable type
        if ($commentable instanceof \App\Models\Article) {
            $link = "/post/{$commentable->slug}#comment-{$this->comment->id}";
        }
        // Add other types like Review, etc.

        return [
            'title' => 'New Reply',
            'message' => "{$this->comment->user->username} replied: " . Str::limit($this->comment->body, 50),
            'category' => 'reply',
            'link' => $link,
            'comment_id' => $this->comment->id,
            'reply_by' => $this->comment->user->username,
            'avatar' => $this->comment->user->avatar
        ];
    }
}
