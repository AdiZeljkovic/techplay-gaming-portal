<?php

namespace App\Filament\Resources\ArticleResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class RevisionsRelationManager extends RelationManager
{
    protected static string $relationship = 'revisions';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('content')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('revision_number')
            ->columns([
                Tables\Columns\TextColumn::make('revision_number')
                    ->label('#')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Changed By')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Date'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                // Revisions are auto-created
            ])
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->form([
                        Forms\Components\KeyValue::make('content')
                            ->label('Snapshot')
                            ->formatStateUsing(fn($state) => is_string($state) ? json_decode($state, true) : $state),
                    ]),
            ])
            ->bulkActions([
                // Revisions should be permanent usually, maybe allow delete for super admin but for now keep safe
            ])
            ->defaultSort('revision_number', 'desc');
    }
}
