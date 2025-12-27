<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PollResource;
use App\Models\Poll;
use App\Models\PollVote;
use Illuminate\Http\Request;

class PollController extends Controller
{
    public function index()
    {
        $polls = Poll::query()
            ->with('options')
            ->where('is_active', true)
            ->latest()
            ->paginate(15);

        return PollResource::collection($polls);
    }

    public function show(Poll $poll)
    {
        return new PollResource($poll->load('options'));
    }

    public function vote(Request $request, Poll $poll)
    {
        if (!$poll->is_active) {
            return response()->json(['message' => 'Poll is closed'], 403);
        }

        if ($poll->ends_at && $poll->ends_at->isPast()) {
            return response()->json(['message' => 'Poll has ended'], 403);
        }

        $validated = $request->validate([
            'option_id' => 'required|exists:poll_options,id',
        ]);

        // Check if user already voted
        $existingVote = PollVote::where('user_id', $request->user()->id)
            ->whereHas('option', fn($q) => $q->where('poll_id', $poll->id))
            ->first();

        if ($existingVote) {
            return response()->json(['message' => 'You already voted'], 403);
        }

        PollVote::create([
            'poll_option_id' => $validated['option_id'],
            'user_id' => $request->user()->id,
        ]);

        return response()->json(['message' => 'Vote recorded']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'options' => 'required|array|min:2',
            'options.*' => 'required|string|max:255',
            'ends_at' => 'nullable|date|after:now',
        ]);

        $poll = Poll::create([
            'question' => $validated['question'],
            'ends_at' => $validated['ends_at'] ?? null,
        ]);

        foreach ($validated['options'] as $option) {
            $poll->options()->create(['label' => $option]);
        }

        return new PollResource($poll->load('options'));
    }

    public function destroy(Poll $poll)
    {
        $poll->delete();
        return response()->json(['message' => 'Poll deleted']);
    }
}
