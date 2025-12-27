<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThreadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'is_pinned' => $this->is_pinned,
            'is_locked' => $this->is_locked,
            'author' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
            ],
            'category' => [
                'id' => $this->forumCategory?->id,
                'name' => $this->forumCategory?->name,
            ],
            'posts_count' => $this->whenCounted('posts'),
            'created_at' => $this->created_at->toISOString(),
            'last_post_at' => $this->updated_at->toISOString(),
        ];
    }
}
