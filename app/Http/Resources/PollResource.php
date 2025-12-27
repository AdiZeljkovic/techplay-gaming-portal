<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PollResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'question' => $this->question,
            'is_active' => $this->is_active,
            'ends_at' => $this->ends_at?->toISOString(),
            'options' => $this->options->map(fn($o) => [
                'id' => $o->id,
                'label' => $o->label,
                'votes_count' => $o->votes()->count(),
            ]),
            'total_votes' => $this->total_votes,
        ];
    }
}
