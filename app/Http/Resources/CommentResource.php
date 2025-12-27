<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'profile_photo_url' => $this->user?->profile_photo_url,
            ],
            'likes_count' => $this->likes_count ?? 0,
            'is_liked' => $this->when($request->user(), fn() => $this->isLikedBy($request->user())),
            'parent_id' => $this->parent_id,
            'replies' => CommentResource::collection($this->whenLoaded('replies')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
