<?php

namespace App\Filament\Resources\TechResource\Pages;

use App\Filament\Resources\TechResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListTeches extends ListRecords
{
    protected static string $resource = TechResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
