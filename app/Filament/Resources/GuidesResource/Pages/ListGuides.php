<?php

namespace App\Filament\Resources\GuidesResource\Pages;

use App\Filament\Resources\GuidesResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListGuides extends ListRecords
{
    protected static string $resource = GuidesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
