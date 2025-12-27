<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'Users & Gamification';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make('roles')
                    ->relationship('roles', 'name')
                    ->multiple()
                    ->preload()
                    ->searchable(),
                Forms\Components\Select::make('rank_id')
                    ->relationship('rank', 'name')
                    ->searchable()
                    ->preload(),
                Forms\Components\TextInput::make('xp')
                    ->numeric()
                    ->default(0),
                Forms\Components\DateTimePicker::make('email_verified_at'),
                Forms\Components\TextInput::make('password')
                    ->password()
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('stripe_id')
                    ->maxLength(255)
                    ->default(null),
                Forms\Components\TextInput::make('pm_type')
                    ->maxLength(255)
                    ->default(null),
                Forms\Components\TextInput::make('pm_last_four')
                    ->maxLength(4)
                    ->default(null),
                Forms\Components\DateTimePicker::make('trial_ends_at'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable(),
                Tables\Columns\IconColumn::make('banned_at')
                    ->label('Status')
                    ->boolean()
                    ->trueIcon('heroicon-o-x-circle')
                    ->falseIcon('heroicon-o-check-circle')
                    ->trueColor('danger')
                    ->falseColor('success')
                    ->getStateUsing(fn($record) => $record->banned_at !== null)
                    ->sortable(),
                Tables\Columns\TextColumn::make('rank.name')
                    ->badge()
                    ->color('info')
                    ->sortable(),
                Tables\Columns\TextColumn::make('xp')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('last_login_at')
                    ->label('Last Login')
                    ->since()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email_verified_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('banned')
                    ->label('User Status')
                    ->placeholder('All users')
                    ->trueLabel('Banned users')
                    ->falseLabel('Active users')
                    ->queries(
                        true: fn(Builder $query) => $query->whereNotNull('banned_at'),
                        false: fn(Builder $query) => $query->whereNull('banned_at'),
                    ),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('ban')
                    ->icon('heroicon-o-no-symbol')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->modalHeading('Ban User')
                    ->modalDescription('Are you sure you want to ban this user?')
                    ->form([
                        Forms\Components\Textarea::make('ban_reason')
                            ->label('Reason for ban')
                            ->placeholder('Enter the reason for banning this user...')
                            ->required(),
                    ])
                    ->action(function (User $record, array $data) {
                        $record->ban($data['ban_reason']);
                    })
                    ->visible(fn(User $record) => !$record->isBanned()),
                Tables\Actions\Action::make('unban')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Unban User')
                    ->modalDescription('Are you sure you want to unban this user?')
                    ->action(fn(User $record) => $record->unban())
                    ->visible(fn(User $record) => $record->isBanned()),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('banSelected')
                        ->label('Ban Selected')
                        ->icon('heroicon-o-no-symbol')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            $records->each->ban('Bulk banned by admin');
                        }),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\SubscriptionsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
