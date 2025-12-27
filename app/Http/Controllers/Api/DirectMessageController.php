<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DirectMessage;
use App\Models\Friendship;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DirectMessageController extends Controller
{
    /**
     * Get inbox (received messages).
     */
    public function index(Request $request): JsonResponse
    {
        $messages = DirectMessage::where('receiver_id', $request->user()->id)
            ->with('sender:id,name,avatar')
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($messages);
    }

    /**
     * Get sent messages.
     */
    public function sent(Request $request): JsonResponse
    {
        $messages = DirectMessage::where('sender_id', $request->user()->id)
            ->with('receiver:id,name,avatar')
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($messages);
    }

    /**
     * Show single message.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $message = DirectMessage::where('id', $id)
            ->where(function ($q) use ($request) {
                $q->where('receiver_id', $request->user()->id)
                    ->orWhere('sender_id', $request->user()->id);
            })
            ->with(['sender:id,name,avatar', 'receiver:id,name,avatar'])
            ->firstOrFail();

        // Mark as read if receiver
        if ($message->receiver_id === $request->user()->id && !$message->read_at) {
            $message->markAsRead();
        }

        return response()->json($message);
    }

    /**
     * Send a message to a friend.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string|max:2000',
        ]);

        $userId = $request->user()->id;
        $receiverId = $validated['receiver_id'];

        // Check if friendship exists (both directions)
        $friendshipExists = Friendship::where('status', 'accepted')
            ->where(function ($q) use ($userId, $receiverId) {
                $q->where(function ($sub) use ($userId, $receiverId) {
                    $sub->where('sender_id', $userId)->where('recipient_id', $receiverId);
                })->orWhere(function ($sub) use ($userId, $receiverId) {
                    $sub->where('sender_id', $receiverId)->where('recipient_id', $userId);
                });
            })
            ->exists();

        if (!$friendshipExists) {
            return response()->json(['error' => 'You can only message friends.'], 403);
        }

        $message = DirectMessage::create([
            'sender_id' => $userId,
            'receiver_id' => $receiverId,
            'content' => $validated['content'],
        ]);

        return response()->json($message, 201);
    }

    /**
     * Delete a message.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $message = DirectMessage::where('id', $id)
            ->where(function ($q) use ($request) {
                $q->where('receiver_id', $request->user()->id)
                    ->orWhere('sender_id', $request->user()->id);
            })
            ->firstOrFail();

        $message->delete();

        return response()->json(['message' => 'Message deleted.']);
    }
}
