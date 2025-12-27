<?php

namespace App\Filament\Widgets;

use App\Models\Article;
use App\Models\User;
use App\Models\Review;
use App\Models\Thread;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Total Articles', Article::count())
                ->description('Published: ' . Article::where('status', 'published')->count())
                ->descriptionIcon('heroicon-m-document-text')
                ->color('success'),
            Stat::make('Total Users', User::count())
                ->description('This month: ' . User::whereMonth('created_at', now()->month)->count())
                ->descriptionIcon('heroicon-m-users')
                ->color('primary'),
            Stat::make('Total Reviews', Review::count())
                ->description('Average score: ' . number_format(Review::with('scoreSegments')->get()->flatMap->scoreSegments->avg('score') ?? 0, 1))
                ->descriptionIcon('heroicon-m-star')
                ->color('warning'),
            Stat::make('Forum Threads', Thread::count())
                ->description('Active discussions')
                ->descriptionIcon('heroicon-m-chat-bubble-left-right')
                ->color('info'),
        ];
    }
}
