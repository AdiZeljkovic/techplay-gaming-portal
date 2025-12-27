<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserMentioned extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $sender;
    public $comment;
    public $link;

    /**
     * Create a new notification instance.
     */
    public function __construct($sender, $comment, $link)
    {
        $this->sender = $sender;
        $this->comment = $comment;
        $this->link = $link;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'mention',
            'title' => 'You were mentioned by ' . $this->sender->name,
            'body' => \Illuminate\Support\Str::limit($this->comment->body, 100),
            'action_url' => $this->link,
            'sender_id' => $this->sender->id,
            'sender_avatar' => $this->sender->avatar,
        ];
    }
}
