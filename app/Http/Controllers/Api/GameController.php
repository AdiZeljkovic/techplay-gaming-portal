<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Game;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Cache key based on all request parameters
        $cacheKey = 'games_index_' . md5(json_encode($request->all()));

        $games = \Illuminate\Support\Facades\Cache::remember($cacheKey, 60 * 10, function () use ($request) {
            $query = Game::query()->select([
                'id',
                'name',
                'slug',
                'released',
                'background_image',
                'rating',
                'metacritic',
                'genres'
            ]);

            if ($request->has('search') && $request->search) {
                $query->where('name', 'like', '%' . $request->search . '%');
            }

            // Filtering
            if ($request->has('dates')) {
                $dates = explode(',', $request->dates);
                if (count($dates) === 2) {
                    $query->whereBetween('released', [$dates[0], $dates[1]]);
                }
            }

            if ($request->has('genres') && $request->genres) {
                // Placeholder for genre filtering
            }

            // Sorting
            if ($request->has('ordering')) {
                $ordering = $request->ordering;
                if ($ordering === '-metacritic')
                    $query->orderBy('metacritic', 'desc');
                elseif ($ordering === '-released')
                    $query->orderBy('released', 'desc');
                elseif ($ordering === '-rating')
                    $query->orderBy('rating', 'desc');
                else
                    $query->orderBy('name'); // default
            } else {
                $query->orderBy('metacritic', 'desc');
            }

            return $query->paginate($request->page_size ?? 12);
        });

        return response()->json([
            'count' => $games->total(),
            'next' => $games->nextPageUrl(),
            'previous' => $games->previousPageUrl(),
            'results' => $games->items()
        ]);
    }

    /**
     * Display the specified resource.
     */
    protected $syncService;

    public function __construct(\App\Services\GameSyncService $syncService)
    {
        $this->syncService = $syncService;
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        // Don't cache 'show' heavily as it triggers sync logic
        // We can add short cache ONLY if game exists
        $game = Game::where('slug', $slug)
            ->orWhere('rawg_id', $slug)
            ->first();

        if (!$game) {
            // Attempt to sync from RAWG on-the-fly
            $game = $this->syncService->fetchAndSync($slug);
        }

        if (!$game) {
            abort(404, 'Game not found');
        }

        // Return with user score appended
        return response()->json($game);
    }

    public function screenshots($slug)
    {
        // For MVP, we return empty or extract from game if stored.
        // todo: Add screenshots table or column.
        return response()->json(['count' => 0, 'results' => []]);
    }

    public function trailers($slug)
    {
        // For MVP, return empty.
        return response()->json(['count' => 0, 'results' => []]);
    }

    public function stores($slug)
    {
        return \Illuminate\Support\Facades\Cache::remember("game_stores_{$slug}", 60 * 60, function () use ($slug) {
            $game = Game::where('slug', $slug)
                ->orWhere('rawg_id', $slug)
                ->firstOrFail();

            // The 'stores' column is already JSON casted in model
            // Structure in DB: [{"store": {...}, "url": ...}] from RAWG
            return response()->json(['count' => count($game->stores ?? []), 'results' => $game->stores]);
        });
    }
}
