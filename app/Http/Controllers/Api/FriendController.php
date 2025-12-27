<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FriendController extends Controller
{
    /**
     * List friends and pending requests.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'friends' => $user->friends,
            'requests' => $user->friendRequests()->with('sender')->get(),
            'pending_sent' => Friendship::where('sender_id', $user->id)->where('status', 'pending')->with('recipient')->get()
        ]);
    }

    /**
     * Send friend request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'recipient_id' => 'required|exists:users,id',
        ]);

        $sender = $request->user();
        $recipientId = $request->recipient_id;

        if ($sender->id == $recipientId) {
            return response()->json(['message' => 'Cannot add yourself'], 400);
        }

        // Check exists
        if (
            Friendship::where(function ($q) use ($sender, $recipientId) {
                $q->where('sender_id', $sender->id)->where('recipient_id', $recipientId);
            })->orWhere(function ($q) use ($sender, $recipientId) {
                $q->where('sender_id', $recipientId)->where('recipient_id', $sender->id);
            })->exists()
        ) {
            return response()->json(['message' => 'Request already exists or you are already friends'], 400);
        }

        Friendship::create([
            'sender_id' => $sender->id,
            'recipient_id' => $recipientId,
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Friend request sent']);
    }

    /**
     * Accept friend request.
     */
    public function update(Request $request, $id)
    {
        $friendship = Friendship::where('id', $id)
            ->where('recipient_id', $request->user()->id)
            ->firstOrFail();

        $friendship->update(['status' => 'accepted']);

        // Check Achievements
        $user = $request->user();

        // Count for both users
        // Use fresh() to get updated count including the one just accepted
        $userCount = $user->fresh()->friends->count();
        $user->checkAchievementUnlock('friends_count', $userCount);

        // Check for the sender too
        $sender = User::find($friendship->sender_id);
        if ($sender) {
            $senderCount = $sender->fresh()->friends->count();
            $sender->checkAchievementUnlock('friends_count', $senderCount);
        }

        return response()->json(['message' => 'Friend request accepted']);
    }

    /**
     * Remove friend or reject request.
     */
    public function destroy(Request $request, $id)
    {
        // Allow deleting if user is sender OR recipient
        Friendship::where('id', $id)
            ->where(function ($q) use ($request) {
                $q->where('sender_id', $request->user()->id)
                    ->orWhere('recipient_id', $request->user()->id);
            })
            ->delete();

        return response()->json(['message' => 'Removed']);
    }

    /**
     * Search users to add.
     */
    public function search(Request $request)
    {
        $query = $request->get('query');
        if (strlen($query) < 3)
            return response()->json([]);

        return User::search($query)->take(10)->get()->map(function ($user) use ($request) {
            // Add status
            $me = $request->user();
            $isFriend = $me->isFriendWith($user);
            $hasPending = $me->hasPendingRequestFrom($user);
            $sentPending = $me->hasSentRequestTo($user);

            $user->friendship_status = $isFriend ? 'friend' : ($hasPending ? 'request_received' : ($sentPending ? 'request_sent' : 'none'));
            return $user;
        });
    }
}
