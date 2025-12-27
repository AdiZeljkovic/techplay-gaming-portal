<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use Filament\Tables;
use Spatie\Activitylog\Models\Activity;

class ActivityLog extends Page implements HasTable
{
    use InteractsWithTable;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationGroup = 'Settings';
    protected static ?string $navigationLabel = 'Activity Log';
    protected static ?int $navigationSort = 100;

    protected static string $view = 'filament.pages.activity-log';

    public function table(Table $table): Table
    {
        return $table
            ->query(Activity::query()->latest())
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('log_name')
                    ->label('Log')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'default' => 'gray',
                        'user' => 'info',
                        'article' => 'success',
                        default => 'warning',
                    }),
                Tables\Columns\TextColumn::make('description')
                    ->label('Action')
                    ->searchable(),
                Tables\Columns\TextColumn::make('subject_type')
                    ->label('Model')
                    ->formatStateUsing(fn($state) => $state ? class_basename($state) : '-'),
                Tables\Columns\TextColumn::make('subject_id')
                    ->label('ID'),
                Tables\Columns\TextColumn::make('causer.name')
                    ->label('User')
                    ->default('System'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('log_name')
                    ->label('Log Type')
                    ->options([
                        'default' => 'Default',
                        'user' => 'User',
                        'article' => 'Article',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->modalContent(function (Activity $record) {
                        return view('filament.pages.activity-log-details', ['activity' => $record]);
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkAction::make('export')
                    ->label('Export to CSV')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->action(function ($records) {
                        $content = "Date,Log,Action,Model,ID,User\n";
                        foreach ($records as $record) {
                            $content .= "{$record->created_at},{$record->log_name},\"{$record->description}\"," .
                                ($record->subject_type ? class_basename($record->subject_type) : '-') . "," .
                                "{$record->subject_id}," .
                                ($record->causer?->name ?? 'System') . "\n";
                        }
                        return response()->streamDownload(fn() => print ($content), 'activity_log.csv');
                    })
                    ->deselectRecordsAfterCompletion(),
            ])
            ->defaultSort('created_at', 'desc')
            ->paginated([10, 25, 50, 100]);
    }
}
