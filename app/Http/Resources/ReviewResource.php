<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'summary' => $this->summary,
            'verdict' => $this->verdict,
            'published_at' => $this->published_at?->toISOString(),
            'author' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
            ],
            'scores' => $this->scoreSegments->map(fn($s) => [
                'name' => $s->name,
                'score' => $s->score,
            ]),
            'rating' => $this->rating,
            'average_score' => $this->scoreSegments->avg('score'),
            'badges' => $this->badges->pluck('name'),
            'reviewable_type' => class_basename($this->reviewable_type),
            'reviewable_id' => $this->reviewable_id,
        ];
    }
}
