<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

use App\Models\Order;

class OrderCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Order Confirmation - #' . $this->order->order_number)
            ->greeting('Thank you for your order!')
            ->line('Your order #' . $this->order->order_number . ' has been placed successfully.')
            ->line('Order Total: $' . number_format((float) $this->order->total, 2))
            ->action('View Your Orders', url('/profile'))
            ->line('We will notify you when your order ships.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Order Placed Successfully',
            'message' => "Your order #{$this->order->order_number} for \${$this->order->total} has been placed.",
            'category' => 'shop',
            'link' => '/profile',
            'order_id' => $this->order->id
        ];
    }
}
