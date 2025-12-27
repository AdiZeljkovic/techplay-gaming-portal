<?php

namespace App\Filament\Resources\EditorialReviewResource\Pages;

use App\Filament\Resources\EditorialReviewResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditEditorialReview extends EditRecord
{
    protected static string $resource = EditorialReviewResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
