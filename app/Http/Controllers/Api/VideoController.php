<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $videos = Video::query()
            ->orderBy('is_featured', 'desc')
            ->orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json($videos);
    }
}
