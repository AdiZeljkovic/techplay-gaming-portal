<?php

namespace App\Notifications;

use App\Models\User;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewUserRegistered extends Notification
{
    use Queueable;

    public function __construct(
        public User $user
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return FilamentNotification::make()
            ->title('New User Registered')
            ->body("{$this->user->name} ({$this->user->email}) has joined.")
            ->icon('heroicon-o-user-plus')
            ->color('info')
            ->actions([
                \Filament\Notifications\Actions\Action::make('view')
                    ->button()
                    ->url(route('filament.admin.resources.users.edit', $this->user))
                    ->markAsRead(),
            ])
            ->getDatabaseMessage();
    }
}
