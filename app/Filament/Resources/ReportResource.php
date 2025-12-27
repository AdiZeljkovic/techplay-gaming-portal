<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReportResource\Pages;
use App\Models\Report;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ReportResource extends Resource
{
    protected static ?string $model = Report::class;

    protected static ?string $navigationIcon = 'heroicon-o-flag';
    protected static ?string $navigationGroup = 'Community';
    protected static ?string $navigationLabel = 'Content Reports';
    protected static ?int $navigationSort = 10;

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'pending')->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'danger';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Report Details')
                    ->schema([
                        Forms\Components\TextInput::make('reportable_type')
                            ->label('Content Type')
                            ->disabled(),
                        Forms\Components\TextInput::make('reportable_id')
                            ->label('Content ID')
                            ->disabled(),
                        Forms\Components\Select::make('reason')
                            ->options([
                                'spam' => '🚫 Spam',
                                'inappropriate' => '⚠️ Inappropriate',
                                'harassment' => '😠 Harassment',
                                'misinformation' => '❌ Misinformation',
                                'other' => '📝 Other',
                            ])
                            ->disabled(),
                        Forms\Components\Textarea::make('description')
                            ->label('User Description')
                            ->disabled()
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Reporter')
                    ->schema([
                        Forms\Components\Select::make('reporter_id')
                            ->relationship('reporter', 'name')
                            ->disabled(),
                    ]),

                Forms\Components\Section::make('Admin Review')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => '⏳ Pending',
                                'reviewed' => '👁️ Reviewed',
                                'resolved' => '✅ Resolved',
                                'dismissed' => '❌ Dismissed',
                            ])
                            ->required(),
                        Forms\Components\Textarea::make('admin_notes')
                            ->label('Admin Notes')
                            ->placeholder('Add notes about this report...')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('reporter.name')
                    ->label('Reporter')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('reportable_type')
                    ->label('Type')
                    ->formatStateUsing(fn(string $state): string => class_basename($state))
                    ->badge()
                    ->color('gray'),
                Tables\Columns\TextColumn::make('reason')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'spam' => 'gray',
                        'inappropriate' => 'warning',
                        'harassment' => 'danger',
                        'misinformation' => 'danger',
                        'other' => 'info',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'pending' => 'warning',
                        'reviewed' => 'info',
                        'resolved' => 'success',
                        'dismissed' => 'gray',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Reported')
                    ->since()
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'reviewed' => 'Reviewed',
                        'resolved' => 'Resolved',
                        'dismissed' => 'Dismissed',
                    ]),
                Tables\Filters\SelectFilter::make('reason')
                    ->options([
                        'spam' => 'Spam',
                        'inappropriate' => 'Inappropriate',
                        'harassment' => 'Harassment',
                        'misinformation' => 'Misinformation',
                        'other' => 'Other',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('resolve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn(Report $record) => $record->markAsReviewed(auth()->user(), 'resolved'))
                    ->visible(fn(Report $record) => $record->status === 'pending'),
                Tables\Actions\Action::make('dismiss')
                    ->icon('heroicon-o-x-circle')
                    ->color('gray')
                    ->requiresConfirmation()
                    ->action(fn(Report $record) => $record->markAsReviewed(auth()->user(), 'dismissed'))
                    ->visible(fn(Report $record) => $record->status === 'pending'),
                Tables\Actions\Action::make('banUser')
                    ->label('Ban Reporter')
                    ->icon('heroicon-o-no-symbol')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(function (Report $record) {
                        // This bans the person who made false reports (if needed)
                    })
                    ->visible(fn(Report $record) => $record->status === 'dismissed'),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('resolveAll')
                        ->label('Resolve Selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            $records->each(fn($r) => $r->markAsReviewed(auth()->user(), 'resolved'));
                        }),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReports::route('/'),
            'edit' => Pages\EditReport::route('/{record}/edit'),
        ];
    }
}
