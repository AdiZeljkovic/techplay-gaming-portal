<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'E-Commerce';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('order_number')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->default(null),
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'processing' => 'Processing',
                        'shipped' => 'Shipped',
                        'delivered' => 'Delivered',
                        'cancelled' => 'Cancelled',
                    ])
                    ->required()
                    ->default('pending'),
                Forms\Components\TextInput::make('subtotal')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('tax')
                    ->required()
                    ->numeric()
                    ->default(0.00),
                Forms\Components\TextInput::make('shipping_cost')
                    ->required()
                    ->numeric()
                    ->default(0.00),
                Forms\Components\TextInput::make('discount')
                    ->required()
                    ->numeric()
                    ->default(0.00),
                Forms\Components\TextInput::make('total')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('currency')
                    ->required()
                    ->maxLength(255)
                    ->default('EUR'),
                Forms\Components\TextInput::make('shipping_name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('shipping_email')
                    ->email()
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('shipping_phone')
                    ->tel()
                    ->maxLength(255)
                    ->default(null),
                Forms\Components\TextInput::make('shipping_address')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('shipping_city')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('shipping_state')
                    ->maxLength(255)
                    ->default(null),
                Forms\Components\TextInput::make('shipping_postal_code')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('shipping_country')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('billing_name')
                    ->maxLength(255)
                    ->default(null),
                Forms\Components\TextInput::make('billing_address')
                    ->maxLength(255)
                    ->default(null),
                Forms\Components\TextInput::make('billing_city')
                    ->maxLength(255)
                    ->default(null),
                Forms\Components\TextInput::make('billing_postal_code')
                    ->maxLength(255)
                    ->default(null),
                Forms\Components\TextInput::make('billing_country')
                    ->maxLength(255)
                    ->default(null),
                Forms\Components\TextInput::make('payment_method')
                    ->maxLength(255)
                    ->default(null),
                Forms\Components\Select::make('payment_status')
                    ->options([
                        'pending' => 'Pending',
                        'paid' => 'Paid',
                        'failed' => 'Failed',
                        'refunded' => 'Refunded',
                    ])
                    ->required()
                    ->default('pending'),
                Forms\Components\TextInput::make('transaction_id')
                    ->maxLength(255)
                    ->default(null),
                Forms\Components\Textarea::make('notes')
                    ->columnSpanFull(),
                Forms\Components\DateTimePicker::make('paid_at'),
                Forms\Components\DateTimePicker::make('shipped_at'),
                Forms\Components\DateTimePicker::make('delivered_at'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->searchable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'pending' => 'warning',
                        'processing' => 'info',
                        'shipped' => 'primary',
                        'delivered' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    })
                    ->searchable(),
                Tables\Columns\TextColumn::make('total')
                    ->numeric()
                    ->sortable()
                    ->money('eur'),
                Tables\Columns\TextColumn::make('shipping_name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('shipping_city')
                    ->searchable(),
                Tables\Columns\TextColumn::make('shipping_country')
                    ->searchable(),
                Tables\Columns\TextColumn::make('payment_status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'pending' => 'warning',
                        'paid' => 'success',
                        'failed' => 'danger',
                        'refunded' => 'info',
                        default => 'gray',
                    })
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'processing' => 'Processing',
                        'shipped' => 'Shipped',
                        'delivered' => 'Delivered',
                        'cancelled' => 'Cancelled',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                // Status Transition Actions
                Tables\Actions\Action::make('process')
                    ->label('Mark Processing')
                    ->icon('heroicon-o-arrow-path')
                    ->color('info')
                    ->visible(fn(Order $record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->action(fn(Order $record) => $record->update(['status' => 'processing'])),
                Tables\Actions\Action::make('ship')
                    ->label('Mark Shipped')
                    ->icon('heroicon-o-truck')
                    ->color('primary')
                    ->visible(fn(Order $record) => $record->status === 'processing')
                    ->requiresConfirmation()
                    ->action(fn(Order $record) => $record->update(['status' => 'shipped', 'shipped_at' => now()])),
                Tables\Actions\Action::make('deliver')
                    ->label('Mark Delivered')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn(Order $record) => $record->status === 'shipped')
                    ->requiresConfirmation()
                    ->action(fn(Order $record) => $record->update(['status' => 'delivered', 'delivered_at' => now()])),
                Tables\Actions\Action::make('cancel')
                    ->label('Cancel Order')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn(Order $record) => in_array($record->status, ['pending', 'processing']))
                    ->requiresConfirmation()
                    ->action(fn(Order $record) => $record->update(['status' => 'cancelled'])),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('bulk_process')
                        ->label('Mark as Processing')
                        ->icon('heroicon-o-arrow-path')
                        ->color('info')
                        ->requiresConfirmation()
                        ->action(fn(\Illuminate\Database\Eloquent\Collection $records) => $records->each->update(['status' => 'processing'])),
                    Tables\Actions\BulkAction::make('bulk_ship')
                        ->label('Mark as Shipped')
                        ->icon('heroicon-o-truck')
                        ->color('primary')
                        ->requiresConfirmation()
                        ->action(fn(\Illuminate\Database\Eloquent\Collection $records) => $records->each->update(['status' => 'shipped', 'shipped_at' => now()])),
                    Tables\Actions\BulkAction::make('export_csv')
                        ->label('Export to CSV')
                        ->icon('heroicon-o-arrow-down-tray')
                        ->action(function (\Illuminate\Database\Eloquent\Collection $records) {
                            $content = "Order Number,Customer,Status,Total,Created At\n";
                            foreach ($records as $record) {
                                $content .= "{$record->order_number},\"{$record->shipping_name}\",{$record->status},{$record->total},{$record->created_at}\n";
                            }
                            return response()->streamDownload(fn() => print ($content), 'orders_export.csv');
                        })
                        ->deselectRecordsAfterCompletion(),
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
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
