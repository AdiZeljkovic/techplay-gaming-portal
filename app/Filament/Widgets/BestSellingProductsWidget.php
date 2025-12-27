<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class BestSellingProductsWidget extends BaseWidget
{
    protected static ?string $heading = '🔥 Best Selling Products';
    protected static ?int $sort = 7;
    protected int|string|array $columnSpan = 1;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Product::query()
                    ->withSum('orderItems as total_sold', 'quantity')
                    ->orderByDesc('total_sold')
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->circular()
                    ->size(40),
                Tables\Columns\TextColumn::make('name')
                    ->limit(20)
                    ->searchable(),
                Tables\Columns\TextColumn::make('total_sold')
                    ->label('Sold')
                    ->badge()
                    ->color('success'),
                Tables\Columns\TextColumn::make('price')
                    ->money('USD'),
            ])
            ->paginated(false)
            ->emptyStateHeading('No sales yet')
            ->emptyStateDescription('Products will appear here once sold.')
            ->emptyStateIcon('heroicon-o-shopping-bag');
    }
}
