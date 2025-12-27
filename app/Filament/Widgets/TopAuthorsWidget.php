<?php

namespace App\Filament\Widgets;

use App\Models\Article;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Support\Facades\DB;

class TopAuthorsWidget extends BaseWidget
{
    protected static ?string $heading = '🏆 Top Authors (This Month)';
    protected static ?int $sort = 5;
    protected int|string|array $columnSpan = 1;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                \App\Models\User::query()
                    ->whereHas('articles', function ($query) {
                        $query->whereMonth('created_at', now()->month)
                            ->whereYear('created_at', now()->year);
                    })
                    ->withCount([
                        'articles' => function ($query) {
                            $query->whereMonth('created_at', now()->month)
                                ->whereYear('created_at', now()->year);
                        }
                    ])
                    ->orderByDesc('articles_count')
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Author')
                    ->searchable(),
                Tables\Columns\TextColumn::make('articles_count')
                    ->label('Articles')
                    ->badge()
                    ->color('success'),
            ])
            ->paginated(false)
            ->emptyStateHeading('No articles this month')
            ->emptyStateDescription('Authors will appear here once they publish.')
            ->emptyStateIcon('heroicon-o-document-text');
    }
}
