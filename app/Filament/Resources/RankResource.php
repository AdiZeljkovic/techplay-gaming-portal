<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RankResource\Pages;
use App\Filament\Resources\RankResource\RelationManagers;
use App\Models\Rank;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class RankResource extends Resource
{
    protected static ?string $model = Rank::class;

    protected static ?string $navigationIcon = 'heroicon-o-trophy';
    protected static ?string $navigationGroup = 'Users & Gamification';
    protected static ?string $navigationLabel = 'Gaming Ranks';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('level')
                    ->required()
                    ->numeric()
                    ->unique(ignoreRecord: true),
                Forms\Components\TextInput::make('min_xp')
                    ->label('Minimum XP')
                    ->required()
                    ->numeric(),
                Forms\Components\FileUpload::make('icon')
                    ->image()
                    ->directory('ranks')
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('icon'),
                Tables\Columns\TextColumn::make('level')
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('min_xp')
                    ->label('Min XP')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('users_count')
                    ->counts('users')
                    ->label('Users'),
            ])
            ->defaultSort('level', 'asc')
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListRanks::route('/'),
            'create' => Pages\CreateRank::route('/create'),
            'edit' => Pages\EditRank::route('/{record}/edit'),
        ];
    }
}
