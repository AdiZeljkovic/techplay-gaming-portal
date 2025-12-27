<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('online', function ($user) {
    if ($user) {
        return ['id' => $user->id, 'name' => $user->name, 'avatar' => $user->profile_photo_url]; // Adjust fields as needed
    }
});
