<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'E-Commerce';

    public static function form(Form $form): Form
    {
        return $form
            ->columns(3)
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Product Details')
                            ->schema([
                                Forms\Components\TextInput::make('name')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn(string $operation, $state, Forms\Set $set) => $operation === 'create' ? $set('slug', \Illuminate\Support\Str::slug($state)) : null),

                                Forms\Components\TextInput::make('slug')
                                    ->required()
                                    ->maxLength(255)
                                    ->disabled()
                                    ->dehydrated()
                                    ->unique(Product::class, 'slug', ignoreRecord: true),

                                Forms\Components\MarkdownEditor::make('description')
                                    ->columnSpanFull(),

                                Forms\Components\Textarea::make('short_description')
                                    ->rows(3)
                                    ->columnSpanFull(),
                            ])
                            ->columns(2),

                        Forms\Components\Section::make('Pricing & Inventory')
                            ->schema([
                                Forms\Components\TextInput::make('price')
                                    ->required()
                                    ->numeric()
                                    ->prefix('$'),

                                Forms\Components\TextInput::make('sale_price')
                                    ->numeric()
                                    ->prefix('$'),

                                Forms\Components\TextInput::make('sku')
                                    ->label('SKU')
                                    ->maxLength(255),

                                Forms\Components\TextInput::make('stock')
                                    ->required()
                                    ->numeric()
                                    ->default(0),

                                Forms\Components\TextInput::make('weight')
                                    ->label('Weight (kg)')
                                    ->numeric(),
                            ])
                            ->columns(2),

                        Forms\Components\Section::make('Variants')
                            ->schema([
                                Forms\Components\TagsInput::make('sizes')
                                    ->placeholder('Add sizes (S, M, L...)')
                                    ->separator(','),

                                Forms\Components\TagsInput::make('colors')
                                    ->placeholder('Add colors (Red, Blue...)')
                                    ->separator(','),
                            ]),
                    ])
                    ->columnSpan(['lg' => 2]),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Status')
                            ->schema([
                                Forms\Components\Toggle::make('is_active')
                                    ->label('Visible in Store')
                                    ->default(true),

                                Forms\Components\Toggle::make('is_featured')
                                    ->label('Featured Product'),

                                Forms\Components\TextInput::make('sort_order')
                                    ->numeric()
                                    ->default(0),
                            ]),

                        Forms\Components\Section::make('Associations')
                            ->schema([
                                Forms\Components\Select::make('category')
                                    ->options([
                                        'Hoodies' => 'Hoodies',
                                        'T-Shirts' => 'T-Shirts',
                                        'Headwear' => 'Headwear',
                                    ])
                                    ->required()
                                    ->native(false),

                                Forms\Components\TextInput::make('subcategory')
                                    ->label('Subcategory (Optional)'),
                            ]),

                        Forms\Components\Section::make('Media')
                            ->schema([
                                Forms\Components\FileUpload::make('image')
                                    ->label('Main Image')
                                    ->image()
                                    ->directory('products')
                                    ->required(),

                                Forms\Components\FileUpload::make('gallery')
                                    ->label('Gallery Images')
                                    ->image()
                                    ->directory('products/gallery')
                                    ->multiple()
                                    ->reorderable(),
                            ]),
                    ])
                    ->columnSpan(['lg' => 1]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable(),
                Tables\Columns\TextColumn::make('price')
                    ->money()
                    ->sortable(),
                Tables\Columns\TextColumn::make('sale_price')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('sku')
                    ->label('SKU')
                    ->searchable(),
                Tables\Columns\TextColumn::make('stock')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean(),
                Tables\Columns\TextColumn::make('category')
                    ->searchable(),
                Tables\Columns\TextColumn::make('subcategory')
                    ->searchable(),
                Tables\Columns\ImageColumn::make('image'),
                Tables\Columns\TextColumn::make('weight')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
