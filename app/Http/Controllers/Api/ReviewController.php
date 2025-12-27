<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $reviews = Review::query()
            ->with(['user', 'scoreSegments', 'badges'])
            ->whereNotNull('published_at')
            ->when($request->type, fn($q, $t) => $q->where('reviewable_type', $t))
            ->when($request->id, fn($q, $id) => $q->where('reviewable_id', $id))
            ->latest('published_at')
            ->paginate($request->per_page ?? 15);

        return ReviewResource::collection($reviews);
    }

    public function show(Review $review)
    {
        return new ReviewResource($review->load(['user', 'scoreSegments', 'badges']));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'summary' => 'nullable|string',
            'verdict' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:10',
            'reviewable_type' => 'required|string',
            'reviewable_id' => 'required|integer',
        ]);

        $validated['user_id'] = $request->user()->id;
        $review = Review::create($validated);

        // Check Achievements
        $count = $request->user()->reviews()->count();
        app(\App\Services\AchievementService::class)->checkAndUnlock($request->user(), 'review_count', $count);

        return new ReviewResource($review);
    }

    public function update(Request $request, Review $review)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'summary' => 'nullable|string',
            'verdict' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:10',
        ]);

        $review->update($validated);
        return new ReviewResource($review);
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return response()->json(['message' => 'Review deleted']);
    }
}
