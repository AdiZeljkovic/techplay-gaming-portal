<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MediaResource\Pages;
use App\Filament\Resources\MediaResource\RelationManagers;
use App\Models\Media;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class MediaResource extends Resource
{
    protected static ?string $model = Media::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationGroup = 'Settings';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('model_type')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('model_id')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('uuid')
                    ->label('UUID')
                    ->maxLength(36)
                    ->default(null),
                Forms\Components\TextInput::make('collection_name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('file_name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('mime_type')
                    ->maxLength(255)
                    ->default(null),
                Forms\Components\TextInput::make('disk')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('conversions_disk')
                    ->maxLength(255)
                    ->default(null),
                Forms\Components\TextInput::make('size')
                    ->required()
                    ->numeric(),
                Forms\Components\Textarea::make('manipulations')
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\Textarea::make('custom_properties')
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\Textarea::make('generated_conversions')
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\Textarea::make('responsive_images')
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('order_column')
                    ->numeric()
                    ->default(null),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('model')
                    ->label('Preview')
                    ->circular()
                    ->defaultImageUrl(fn($record) => $record->getUrl()),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('file_name')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('collection_name')
                    ->badge()
                    ->color('gray'),
                Tables\Columns\TextColumn::make('mime_type')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('size')
                    ->formatStateUsing(fn($state) => number_format($state / 1024, 2) . ' KB'),
                Tables\Columns\TextColumn::make('model_type')
                    ->label('Attached To')
                    ->formatStateUsing(fn($state) => class_basename($state))
                    ->badge(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('collection_name')
                    ->options([
                        'articles' => 'Articles',
                        'products' => 'Products',
                        'avatars' => 'Avatars',
                        'default' => 'Default',
                    ]),
            ])
            ->actions([
                Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListMedia::route('/'),
            'create' => Pages\CreateMedia::route('/create'),
            'edit' => Pages\EditMedia::route('/{record}/edit'),
        ];
    }
}
