<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ThreadResource;
use App\Models\Thread;
use App\Models\Post;
use Illuminate\Http\Request;

class ThreadController extends Controller
{
    public function index(Request $request)
    {
        $threads = Thread::query()
            ->with(['user', 'forumCategory'])
            ->withCount('posts')
            ->when($request->category, fn($q, $c) => $q->where('forum_category_id', $c))
            ->orderByDesc('is_pinned')
            ->latest('updated_at')
            ->paginate($request->per_page ?? 15);

        return ThreadResource::collection($threads);
    }

    public function show(Thread $thread)
    {
        return new ThreadResource($thread->load(['user', 'forumCategory', 'posts.user']));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'forum_category_id' => 'required|exists:forum_categories,id',
            'body' => 'required|string',
        ]);

        $thread = Thread::create([
            'title' => $validated['title'],
            'slug' => \Illuminate\Support\Str::slug($validated['title']),
            'forum_category_id' => $validated['forum_category_id'],
            'user_id' => $request->user()->id,
        ]);

        // Create first post
        $thread->posts()->create([
            'body' => $validated['body'],
            'user_id' => $request->user()->id,
        ]);

        return new ThreadResource($thread);
    }

    public function update(Request $request, Thread $thread)
    {
        if ($request->user()->id !== $thread->user_id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string', // Optional if we allow updating OP body via thread update
            'is_pinned' => 'boolean',
            'is_locked' => 'boolean',
        ]);

        $thread->update($request->only('title', 'is_pinned', 'is_locked'));

        return new ThreadResource($thread);
    }

    public function reply(Request $request, Thread $thread)
    {
        if ($thread->is_locked) {
            return response()->json(['message' => 'Thread is locked'], 403);
        }

        $validated = $request->validate([
            'body' => 'required|string',
        ]);

        $post = $thread->posts()->create([
            'body' => $validated['body'],
            'user_id' => $request->user()->id,
        ]);

        return response()->json(['data' => $post->load('user')]);
    }

    public function destroy(Thread $thread)
    {
        $thread->delete();
        return response()->json(['message' => 'Thread deleted']);
    }
}
