<?php

namespace App\Filament\Resources\TechResource\Pages;

use App\Filament\Resources\TechResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTech extends EditRecord
{
    protected static string $resource = TechResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
