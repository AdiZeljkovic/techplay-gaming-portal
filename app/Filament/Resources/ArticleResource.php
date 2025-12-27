<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ArticleResource\Pages;
use App\Filament\Resources\ArticleResource\RelationManagers;
use App\Models\Article;
use Filament\Forms\Set;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ArticleResource extends Resource
{
    protected static ?string $model = Article::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationGroup = 'Editorial';
    protected static ?int $navigationSort = 1;
    protected static bool $shouldRegisterNavigation = false;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Tabs::make('Article Details')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('Content')
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn(string $operation, $state, Set $set) => $operation === 'create' ? $set('slug', \Illuminate\Support\Str::slug($state)) : null),
                                Forms\Components\TextInput::make('slug')
                                    ->disabled()
                                    ->dehydrated()
                                    ->required()
                                    ->unique(Article::class, 'slug', ignoreRecord: true),
                                Forms\Components\Select::make('category_id')
                                    ->relationship('category', 'name')
                                    ->searchable()
                                    ->preload(),
                                Forms\Components\Select::make('user_id')
                                    ->relationship('author', 'name')
                                    ->searchable()
                                    ->required(),
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
                                        'live' => 'Live',
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
                        Forms\Components\Tabs\Tab::make('Live Updates')
                            ->schema([
                                Forms\Components\Repeater::make('liveUpdates')
                                    ->relationship()
                                    ->schema([
                                        Forms\Components\Textarea::make('content')
                                            ->required()
                                            ->rows(3),
                                    ])
                                    ->defaultItems(0),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->searchable(),
                Tables\Columns\TextColumn::make('status')->badge(),
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
                    Tables\Actions\BulkAction::make('publish')
                        ->action(fn(\Illuminate\Database\Eloquent\Collection $records) => $records->each->update(['status' => 'published']))
                        ->requiresConfirmation()
                        ->color('success')
                        ->icon('heroicon-o-check'),
                    Tables\Actions\BulkAction::make('unpublish')
                        ->action(fn(\Illuminate\Database\Eloquent\Collection $records) => $records->each->update(['status' => 'draft']))
                        ->requiresConfirmation()
                        ->color('warning')
                        ->icon('heroicon-o-x-mark'),
                    Tables\Actions\BulkAction::make('export_csv')
                        ->label('Export to CSV')
                        ->icon('heroicon-o-arrow-down-tray')
                        ->action(function (\Illuminate\Database\Eloquent\Collection $records) {
                            $content = "ID,Title,Status,Published At\n";
                            foreach ($records as $record) {
                                $content .= "{$record->id},\"{$record->title}\",{$record->status},{$record->published_at}\n";
                            }
                            return response()->streamDownload(fn() => print ($content), 'articles_export.csv');
                        })
                        ->deselectRecordsAfterCompletion(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\RevisionsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListArticles::route('/'),
            'create' => Pages\CreateArticle::route('/create'),
            'edit' => Pages\EditArticle::route('/{record}/edit'),
        ];
    }
}
