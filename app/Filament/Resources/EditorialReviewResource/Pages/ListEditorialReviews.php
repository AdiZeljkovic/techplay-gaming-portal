<?php

namespace App\Filament\Resources\EditorialReviewResource\Pages;

use App\Filament\Resources\EditorialReviewResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListEditorialReviews extends ListRecords
{
    protected static string $resource = EditorialReviewResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
