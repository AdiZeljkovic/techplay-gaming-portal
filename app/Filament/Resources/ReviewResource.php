<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReviewResource\Pages;
use App\Filament\Resources\ReviewResource\RelationManagers;
use App\Models\Review;
use App\Models\Article;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ReviewResource extends Resource
{
    protected static ?string $model = Review::class;

    protected static ?string $navigationGroup = 'Editorial';
    protected static ?string $navigationLabel = 'User Ratings';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                \Filament\Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->required(),
                \Filament\Forms\Components\MorphToSelect::make('reviewable')
                    ->types([
                        \Filament\Forms\Components\MorphToSelect\Type::make(Article::class)
                            ->titleAttribute('title'),
                    ])
                    ->required(),
                \Filament\Forms\Components\TextInput::make('title')
                    ->required(),
                \Filament\Forms\Components\RichEditor::make('body')
                    ->required()
                    ->columnSpanFull(),
                \Filament\Forms\Components\Textarea::make('summary')
                    ->rows(3)
                    ->columnSpanFull(),
                \Filament\Forms\Components\TextInput::make('verdict'),
                \Filament\Forms\Components\Section::make('Scores')
                    ->schema([
                        \Filament\Forms\Components\Repeater::make('scoreSegments')
                            ->relationship()
                            ->schema([
                                \Filament\Forms\Components\TextInput::make('name')->required(),
                                \Filament\Forms\Components\TextInput::make('score')->numeric()->required(),
                            ])
                            ->columns(2),
                    ]),
                \Filament\Forms\Components\CheckboxList::make('badges')
                    ->relationship('badges', 'name'),
                \Filament\Forms\Components\DateTimePicker::make('published_at'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                //
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
            'index' => Pages\ListReviews::route('/'),
            'create' => Pages\CreateReview::route('/create'),
            'edit' => Pages\EditReview::route('/{record}/edit'),
        ];
    }
}
