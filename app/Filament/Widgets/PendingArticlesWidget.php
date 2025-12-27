<?php

namespace App\Filament\Widgets;

use App\Models\Article;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class PendingArticlesWidget extends BaseWidget
{
    protected static ?string $heading = '📝 Pending Review';
    protected static ?int $sort = 3;
    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Article::query()
                    ->where('status', 'draft')
                    ->orWhere('status', 'review')
                    ->latest()
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Title')
                    ->limit(40)
                    ->searchable(),
                Tables\Columns\TextColumn::make('section')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'news' => 'info',
                        'reviews' => 'warning',
                        'tech' => 'success',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'draft' => 'gray',
                        'review' => 'warning',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('author.name')
                    ->label('Author'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->since(),
            ])
            ->actions([
                Tables\Actions\Action::make('edit')
                    ->url(fn(Article $record): string => route('filament.admin.resources.articles.edit', $record))
                    ->icon('heroicon-o-pencil'),
            ])
            ->emptyStateHeading('No pending articles')
            ->emptyStateDescription('All articles have been reviewed.')
            ->emptyStateIcon('heroicon-o-check-circle');
    }
}
