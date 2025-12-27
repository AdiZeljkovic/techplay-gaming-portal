<?php

namespace App\Enums;

use Illuminate\Support\Collection;

enum TaskStatus: string
{
    case Todo = 'todo';
    case InProgress = 'in_progress';
    case Done = 'done';

    public function getLabel(): string
    {
        return match ($this) {
            self::Todo => 'To Do',
            self::InProgress => 'In Progress',
            self::Done => 'Done',
        };
    }

    public static function statuses(): Collection
    {
        return collect(self::cases())->map(fn($status) => [
            'id' => $status->value,
            'title' => $status->getLabel(),
        ]);
    }
}
