<?php

namespace App\Notifications;

use App\Models\Order;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewOrderNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Order $order
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return FilamentNotification::make()
            ->title('New Order Received')
            ->body("Order #{$this->order->order_number} by {$this->order->user->name} ($" . number_format((float) $this->order->total, 2) . ")")
            ->icon('heroicon-o-shopping-bag')
            ->color('success')
            ->actions([
                \Filament\Notifications\Actions\Action::make('view')
                    ->button()
                    ->url(route('filament.admin.resources.orders.edit', $this->order))
                    ->markAsRead(),
            ])
            ->getDatabaseMessage();
    }
}
