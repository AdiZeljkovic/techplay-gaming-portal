<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * Only returns safe, public-facing user data.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'profile_photo_url' => $this->profile_photo_url,
            'role' => $this->whenLoaded('roles', fn() => $this->roles->first()?->name),
            'rank' => $this->whenLoaded('rank', fn() => [
                'name' => $this->rank?->name,
                'icon' => $this->rank?->icon,
            ]),
            'level' => $this->profile?->level ?? 1,
            'xp' => $this->xp ?? 0,
            'bio' => $this->profile?->bio,
            'created_at' => $this->created_at?->toISOString(),
            // Conditionally include email only for authenticated user viewing their own profile
            'email' => $this->when($request->user()?->id === $this->id, $this->email),
        ];
    }
}
