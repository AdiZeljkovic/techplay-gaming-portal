<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $events = Event::query()
            ->when($request->from, fn($q, $d) => $q->where('starts_at', '>=', $d))
            ->when($request->to, fn($q, $d) => $q->where('starts_at', '<=', $d))
            ->orderBy('starts_at')
            ->paginate($request->per_page ?? 30);

        return EventResource::collection($events);
    }

    public function show(Event $event)
    {
        return new EventResource($event);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'starts_at' => 'required|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'is_all_day' => 'boolean',
        ]);

        return new EventResource(Event::create($validated));
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'starts_at' => 'sometimes|date',
            'ends_at' => 'nullable|date',
            'is_all_day' => 'boolean',
        ]);

        $event->update($validated);
        return new EventResource($event);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }
}
