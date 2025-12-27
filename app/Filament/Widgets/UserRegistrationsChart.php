<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class UserRegistrationsChart extends ChartWidget
{
    protected static ?string $heading = '📈 User Registrations (Last 30 Days)';
    protected static ?int $sort = 5;
    protected int|string|array $columnSpan = 'full';

    protected function getData(): array
    {
        $data = collect(range(29, 0))->map(function ($daysAgo) {
            $date = Carbon::now()->subDays($daysAgo);
            return [
                'date' => $date->format('M d'),
                'count' => User::whereDate('created_at', $date)->count(),
            ];
        });

        return [
            'datasets' => [
                [
                    'label' => 'New Users',
                    'data' => $data->pluck('count')->toArray(),
                    'backgroundColor' => 'rgba(99, 102, 241, 0.2)',
                    'borderColor' => 'rgb(99, 102, 241)',
                    'fill' => true,
                    'tension' => 0.3,
                ],
            ],
            'labels' => $data->pluck('date')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
