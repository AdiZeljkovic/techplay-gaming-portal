<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GuidesResource\Pages;
use App\Models\Article;
use Filament\Forms\Set;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class GuidesResource extends Resource
{
    protected static ?string $model = Article::class;

    protected static ?string $navigationLabel = 'Guides';

    protected static ?string $navigationIcon = 'heroicon-o-book-open';

    protected static ?string $navigationGroup = 'Editorial';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->guides();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Hidden::make('section')->default('guides'),
                Forms\Components\Tabs::make('Guide Details')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('Content')
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(function (string $operation, $state, Set $set) {
                                        if ($operation === 'create') {
                                            $set('slug', \Illuminate\Support\Str::slug($state));
                                            $set('meta_title', $state);
                                        }
                                    }),
                                Forms\Components\TextInput::make('slug')
                                    ->disabled()
                                    ->dehydrated()
                                    ->required()
                                    ->unique(Article::class, 'slug', ignoreRecord: true),
                                Forms\Components\Textarea::make('excerpt')
                                    ->label('Summary/Excerpt')
                                    ->rows(3)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(function (string $operation, $state, Set $set) {
                                        if ($operation !== 'create')
                                            return;
                                        $set('meta_description', \Illuminate\Support\Str::limit($state, 160));
                                    })
                                    ->columnSpanFull(),
                                Forms\Components\Select::make('category_id')
                                    ->relationship('category', 'name', fn(Builder $query) => $query->where('section', 'guides'))
                                    ->searchable()
                                    ->preload()
                                    ->createOptionForm([
                                        Forms\Components\TextInput::make('name')->required(),
                                        Forms\Components\TextInput::make('slug')->required(),
                                        Forms\Components\Hidden::make('section')->default('guides'),
                                    ]),
                                Forms\Components\Select::make('user_id')
                                    ->relationship('author', 'name')
                                    ->searchable()
                                    ->required()
                                    ->default(auth()->id()),
                                Forms\Components\RichEditor::make('body')
                                    ->required()
                                    ->columnSpanFull(),
                                \Filament\Forms\Components\SpatieTagsInput::make('tags'),
                                \Filament\Forms\Components\SpatieMediaLibraryFileUpload::make('media')
                                    ->collection('articles')
                                    ->multiple()
                                    ->image()
                                    ->imageEditor(),
                                Forms\Components\Select::make('status')
                                    ->options([
                                        'draft' => 'Draft',
                                        'published' => 'Published',
                                    ])
                                    ->default('draft')
                                    ->required(),
                                Forms\Components\DateTimePicker::make('published_at')
                                    ->default(now()),
                            ]),
                        Forms\Components\Tabs\Tab::make('SEO')
                            ->schema([
                                Forms\Components\TextInput::make('meta_title')
                                    ->label('Meta Title')
                                    ->maxLength(60)
                                    ->helperText('Recommended length: 50-60 characters'),
                                Forms\Components\Textarea::make('meta_description')
                                    ->label('Meta Description')
                                    ->maxLength(160)
                                    ->helperText('Recommended length: 150-160 characters')
                                    ->rows(3),
                                Forms\Components\TextInput::make('meta_keywords')
                                    ->label('Keywords')
                                    ->placeholder('Comma separated keywords')
                                    ->helperText('e.g. gaming, ps5, review'),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->searchable()->limit(50),
                Tables\Columns\TextColumn::make('category.name')->badge(),
                Tables\Columns\TextColumn::make('author.name'),
                Tables\Columns\TextColumn::make('status')->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'published' => 'success',
                        'draft' => 'gray',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('published_at')->dateTime(),
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
            'index' => Pages\ListGuides::route('/'),
            'create' => Pages\CreateGuide::route('/create'),
            'edit' => Pages\EditGuide::route('/{record}/edit'),
        ];
    }
}
