<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class RevenueChart extends ChartWidget
{
    protected static ?string $heading = '💰 Revenue (Last 30 Days)';
    protected static ?int $sort = 6;
    protected int|string|array $columnSpan = 'full';

    protected function getData(): array
    {
        $data = collect(range(29, 0))->map(function ($daysAgo) {
            $date = Carbon::now()->subDays($daysAgo);
            $revenue = Order::whereDate('created_at', $date)
                ->where('status', '!=', 'cancelled')
                ->sum('total');
            return [
                'date' => $date->format('M d'),
                'revenue' => $revenue,
            ];
        });

        return [
            'datasets' => [
                [
                    'label' => 'Revenue ($)',
                    'data' => $data->pluck('revenue')->toArray(),
                    'backgroundColor' => 'rgba(16, 185, 129, 0.2)',
                    'borderColor' => 'rgb(16, 185, 129)',
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
