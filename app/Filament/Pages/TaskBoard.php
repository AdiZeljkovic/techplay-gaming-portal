<?php

namespace App\Filament\Pages;

use App\Models\Task;
use App\Enums\TaskStatus;
use Mokhosh\FilamentKanban\Pages\KanbanBoard;

class TaskBoard extends KanbanBoard
{
    protected static string $model = Task::class;
    protected static string $statusEnum = TaskStatus::class;

    protected static ?string $navigationIcon = 'heroicon-o-view-columns';
    protected static ?string $navigationLabel = 'Task Board';
    protected static ?string $navigationGroup = 'Editorial Tools';
    protected static ?string $title = 'Task Board';
    protected static ?int $navigationSort = 1;
}
