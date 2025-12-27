<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LowStockWidget extends BaseWidget
{
    protected static ?string $heading = '⚠️ Low Stock Alert';
    protected static ?int $sort = 8;
    protected int|string|array $columnSpan = 1;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Product::query()
                    ->where('stock', '<', 10)
                    ->where('stock', '>', 0)
                    ->orderBy('stock', 'asc')
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->circular()
                    ->size(40),
                Tables\Columns\TextColumn::make('name')
                    ->limit(25)
                    ->searchable(),
                Tables\Columns\TextColumn::make('stock')
                    ->badge()
                    ->color(fn(int $state): string => match (true) {
                        $state <= 3 => 'danger',
                        $state <= 7 => 'warning',
                        default => 'success',
                    }),
                Tables\Columns\TextColumn::make('price')
                    ->money('USD'),
            ])
            ->actions([
                Tables\Actions\Action::make('restock')
                    ->icon('heroicon-o-plus-circle')
                    ->url(fn(Product $record): string => route('filament.admin.resources.products.edit', $record)),
            ])
            ->emptyStateHeading('Stock levels OK')
            ->emptyStateDescription('No products need restocking.')
            ->emptyStateIcon('heroicon-o-check-circle');
    }
}
