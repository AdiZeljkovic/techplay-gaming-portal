<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ForumPostController extends Controller
{
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        // Policy check would go here, e.g., $this->authorize('update', $post);
        if ($request->user()->id !== $post->user_id && !$request->user()->isAdmin()) { // Assuming isAdmin helper exists or similar logic
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'body' => 'required|string',
        ]);

        $post->update([
            'body' => $validated['body'],
        ]);

        return response()->json(['message' => 'Post updated', 'post' => $post]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Post $post)
    {
        if ($request->user()->id !== $post->user_id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted']);
    }
}
