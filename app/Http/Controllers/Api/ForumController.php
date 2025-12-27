<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ForumCategory;
use App\Models\Thread;
use Illuminate\Http\Request;

class ForumController extends Controller
{
    // Get Category Tree (Sections -> Categories -> Subcategories)
    public function index()
    {
        $categories = ForumCategory::where('is_section', true)
            ->with([
                'children' => function ($query) {
                    // Get direct children (Main Categories)
                    $query->orderBy('order')
                        ->with([
                            'children' => function ($q) {
                        // Get subcategories
                        $q->orderBy('order');
                    }
                        ]);
                }
            ])
            ->orderBy('order')
            ->get();

        return response()->json($categories);
    }

    // Get specific category with threads
    public function showCategory($id)
    {
        $query = ForumCategory::with('parent');

        if (is_numeric($id)) {
            $category = $query->where('id', $id)->first();
        } else {
            $category = $query->where('slug', $id)->first();
        }

        if (!$category) {
            abort(404);
        }

        // Get threads for this category, paginated
        $threads = $category->threads()
            ->with('user') // Eager load author
            ->withCount('posts') // Count replies (assuming posts table exists or using comments)
            ->orderByDesc('is_pinned')
            ->orderByDesc('updated_at')
            ->paginate(20);

        return response()->json([
            'category' => $category,
            'threads' => $threads
        ]);
    }

    // Create a new thread
    public function storeThread(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'forum_category_id' => 'required|exists:forum_categories,id',
        ]);

        // Create Thread
        $thread = Thread::create([
            'forum_category_id' => $validated['forum_category_id'],
            'user_id' => $request->user()->id ?? 1, // Fallback to user 1 if no auth for now
            'title' => $validated['title'],
            'slug' => \Illuminate\Support\Str::slug($validated['title']) . '-' . time(),
        ]);

        return response()->json($thread, 201);
    }

    // Forum Stats
    public function stats()
    {
        $threadCount = Thread::count();
        $memberCount = \App\Models\User::count();
        // Online users: logged in within last 15 minutes (if tracking last_login_at)
        // Or simplified: just a random number based on recent activity for now if accurate tracking isn't set up
        // Currently User model has last_login_at but it might not be updated on every request.
        // Let's use a simple query for now.
        $onlineCount = \App\Models\User::where('last_login_at', '>=', now()->subMinutes(15))->count();

        // Fallback for demo if counts are 0 (e.g. dev env)
        if ($onlineCount == 0)
            $onlineCount = 1;

        return response()->json([
            'threads' => $threadCount,
            'members' => $memberCount,
            'online' => $onlineCount
        ]);
    }
}
