<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PollResource\Pages;
use App\Filament\Resources\PollResource\RelationManagers;
use App\Models\Poll;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PollResource extends Resource
{
    protected static ?string $model = Poll::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'Editorial';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('question')
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\Toggle::make('is_active')
                    ->default(true),
                Forms\Components\DateTimePicker::make('ends_at'),
                Forms\Components\Section::make('Options')
                    ->schema([
                        Forms\Components\Repeater::make('options')
                            ->relationship()
                            ->schema([
                                Forms\Components\TextInput::make('label')->required(),
                            ])
                            ->minItems(2)
                            ->defaultItems(2),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('question')
                    ->searchable()
                    ->limit(50),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('ends_at')
                    ->dateTime(),
                Tables\Columns\TextColumn::make('options_count')
                    ->counts('options')
                    ->label('Options'),
            ])
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
            'index' => Pages\ListPolls::route('/'),
            'create' => Pages\CreatePoll::route('/create'),
            'edit' => Pages\EditPoll::route('/{record}/edit'),
        ];
    }
}
