<?php

namespace App\Filament\Widgets;

use App\Models\Event;
use Saade\FilamentFullCalendar\Widgets\FullCalendarWidget;
use Saade\FilamentFullCalendar\Data\EventData;
use Illuminate\Database\Eloquent\Model;

class EventCalendarWidget extends FullCalendarWidget
{
    protected static ?int $sort = 10;
    protected int|string|array $columnSpan = 'full';

    public Model|string|null $model = Event::class;

    public function fetchEvents(array $fetchInfo): array
    {
        return Event::query()
            ->where('starts_at', '>=', $fetchInfo['start'])
            ->where('starts_at', '<=', $fetchInfo['end'])
            ->get()
            ->map(
                fn(Event $event) => EventData::make()
                    ->id($event->id)
                    ->title($event->title)
                    ->start($event->starts_at)
                    ->end($event->ends_at)
                    ->allDay($event->is_all_day)
            )
            ->toArray();
    }

    public static function canView(): bool
    {
        return true;
    }
}
