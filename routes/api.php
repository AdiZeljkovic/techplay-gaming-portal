<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AchievementController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\PollController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ThreadController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All routes are accessible via /api/...
| API versioning can be added in the future using RouteServiceProvider.
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/debug-session', function () {
    return response()->json([
        'session_domain' => config('session.domain'),
        'session_driver' => config('session.driver'),
        'session_secure' => config('session.secure'),
        'session_same_site' => config('session.same_site'),
        'sanctum_stateful' => config('sanctum.stateful'),
        'app_url' => config('app.url'),
    ]);
});

// Public routes (no auth required) - Throttled
Route::middleware(['throttle:60,1'])->group(function () {

    // Auth Routes (Proxy to Fortify for SPA Cookie Auth)
    // Ensures expected /api/login and /api/logout exist
    Route::post('/login', [\Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::class, 'store']);
    Route::post('/logout', [\Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::class, 'destroy']);
    Route::post('/register', [\Laravel\Fortify\Http\Controllers\RegisteredUserController::class, 'store']);

    // Instant Search
    Route::get('/search', [\App\Http\Controllers\Api\SearchController::class, 'search']);

    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/{article}', [ArticleController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::get('/reviews/{review}', [ReviewController::class, 'show']);
    Route::get('/threads', [ThreadController::class, 'index']);
    Route::get('/threads/{thread}', [ThreadController::class, 'show']);
    Route::get('/polls', [PollController::class, 'index']);
    Route::get('/polls/{poll}', [PollController::class, 'show']);
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{event}', [EventController::class, 'show']);

    // Leaderboard (Public)
    Route::get('/leaderboard', [\App\Http\Controllers\Api\LeaderboardController::class, 'index']);

    // Forum (Public)
    Route::get('/forum/categories', [\App\Http\Controllers\Api\ForumController::class, 'index']);
    Route::get('/forum/stats', [\App\Http\Controllers\Api\ForumController::class, 'stats']);
    Route::get('/forum/categories/{id}', [\App\Http\Controllers\Api\ForumController::class, 'showCategory']);

    Route::get('/games', [\App\Http\Controllers\Api\GameController::class, 'index']);
    Route::get('/games/{slug}', [\App\Http\Controllers\Api\GameController::class, 'show']);
    Route::get('/games/{slug}/screenshots', [\App\Http\Controllers\Api\GameController::class, 'screenshots']);
    Route::get('/games/{slug}/movies', [\App\Http\Controllers\Api\GameController::class, 'trailers']); // Frontend calls /movies
    Route::get('/games/{slug}/stores', [\App\Http\Controllers\Api\GameController::class, 'stores']);
    Route::get('/games/{id}/reviews', [\App\Http\Controllers\Api\GameReviewController::class, 'index']);
    Route::get('/videos', [\App\Http\Controllers\Api\VideoController::class, 'index']);

    // Products (Public)
    Route::get('/products', [\App\Http\Controllers\Api\ProductController::class, 'index']);
    Route::get('/products/featured', [\App\Http\Controllers\Api\ProductController::class, 'featured']);
    Route::get('/products/categories', [\App\Http\Controllers\Api\ProductController::class, 'categories']);
    Route::get('/products/{product}', [\App\Http\Controllers\Api\ProductController::class, 'show']);

    // Product Reviews (Public - Read Only)
    Route::get('/products/{productId}/reviews', [\App\Http\Controllers\ProductReviewController::class, 'index']);

    // Game Ratings (Public - Read Only)
    Route::get('/games/{gameSlug}/ratings', [\App\Http\Controllers\GameRatingController::class, 'index']);

    // Social Auth
    Route::get('/auth/{provider}/redirect', [\App\Http\Controllers\Api\SocialAuthController::class, 'redirectToProvider']);
    Route::get('/auth/{provider}/callback', [\App\Http\Controllers\Api\SocialAuthController::class, 'handleProviderCallback']);

    // Additional public endpoints (latest/popular)
    Route::get('/articles/latest', [\App\Http\Controllers\Api\ArticleController::class, 'latest']);
    Route::get('/articles/popular', [\App\Http\Controllers\Api\ArticleController::class, 'popular']);
});

// Authenticated routes
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    // --- USER ROUTES ---
    // User - with extended profile data for gamification
    Route::get('/user', [\App\Http\Controllers\Api\UserController::class, 'me']);
    Route::get('/user/activity', [\App\Http\Controllers\Api\UserController::class, 'activity']);
    Route::post('/user/profile', [\App\Http\Controllers\Api\UserController::class, 'updateProfile']);
    Route::get('/leaderboard/me', [\App\Http\Controllers\Api\LeaderboardController::class, 'myRank']);

    // Friends
    Route::get('/friends', [\App\Http\Controllers\Api\FriendController::class, 'index']);
    Route::get('/friends/search', [\App\Http\Controllers\Api\FriendController::class, 'search']);
    Route::post('/friends', [\App\Http\Controllers\Api\FriendController::class, 'store']);
    Route::put('/friends/{id}', [\App\Http\Controllers\Api\FriendController::class, 'update']);
    Route::delete('/friends/{id}', [\App\Http\Controllers\Api\FriendController::class, 'destroy']);

    // Direct Messages (Friend Inbox)
    Route::get('/messages', [\App\Http\Controllers\Api\DirectMessageController::class, 'index']);
    Route::get('/messages/sent', [\App\Http\Controllers\Api\DirectMessageController::class, 'sent']);
    Route::get('/messages/{id}', [\App\Http\Controllers\Api\DirectMessageController::class, 'show']);
    Route::post('/messages', [\App\Http\Controllers\Api\DirectMessageController::class, 'store']);
    Route::delete('/messages/{id}', [\App\Http\Controllers\Api\DirectMessageController::class, 'destroy']);

    // Comments & Reviews (User can create)
    Route::post('/comments', [\App\Http\Controllers\Api\CommentController::class, 'store']);
    Route::put('/comments/{comment}', [\App\Http\Controllers\Api\CommentController::class, 'update']); // needs policy
    Route::delete('/comments/{comment}', [\App\Http\Controllers\Api\CommentController::class, 'destroy']); // needs policy
    Route::post('/comments/{comment}/like', [\App\Http\Controllers\Api\CommentController::class, 'toggleLike']);
    Route::post('/games/{id}/reviews', [\App\Http\Controllers\Api\GameReviewController::class, 'store']);

    Route::post('/threads', [ThreadController::class, 'store']);
    Route::put('/threads/{thread}', [ThreadController::class, 'update']);
    Route::post('/threads/{thread}/reply', [ThreadController::class, 'reply']);

    // Forum Posts (Edit/Delete)
    Route::put('/forum/posts/{post}', [\App\Http\Controllers\Api\ForumPostController::class, 'update']);
    Route::delete('/forum/posts/{post}', [\App\Http\Controllers\Api\ForumPostController::class, 'destroy']);

    Route::get('/achievements', [AchievementController::class, 'index']);
    Route::get('/orders', [\App\Http\Controllers\Api\OrderController::class, 'index']);
    Route::get('/orders/{order}', [\App\Http\Controllers\Api\OrderController::class, 'show']);

    Route::post('/polls/{poll}/vote', [PollController::class, 'vote']);

    Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [\App\Http\Controllers\Api\NotificationController::class, 'destroy']);

    // Product Reviews (Authenticated - Write)
    Route::post('/products/{productId}/reviews', [\App\Http\Controllers\ProductReviewController::class, 'store']);
    Route::delete('/products/{productId}/reviews/{reviewId}', [\App\Http\Controllers\ProductReviewController::class, 'destroy']);

    // Game Ratings (Authenticated - Write)
    Route::post('/games/{gameSlug}/ratings', [\App\Http\Controllers\GameRatingController::class, 'store']);

    // --- ADMIN / EDITOR MANAGEMENT ROUTES ---
    Route::middleware(['role:Admin|Editor'])->group(function () {
        // Articles Management
        Route::post('/articles', [ArticleController::class, 'store']);
        Route::put('/articles/{article}', [ArticleController::class, 'update']);
        Route::delete('/articles/{article}', [ArticleController::class, 'destroy']);

        // Categories Management
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        // Products Management
        Route::post('/products', [\App\Http\Controllers\Api\ProductController::class, 'store']);
        Route::put('/products/{product}', [\App\Http\Controllers\Api\ProductController::class, 'update']);
        Route::delete('/products/{product}', [\App\Http\Controllers\Api\ProductController::class, 'destroy']);

        // Events
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{event}', [EventController::class, 'update']);
        Route::delete('/events/{event}', [EventController::class, 'destroy']);

        // Polls Management
        Route::post('/polls', [PollController::class, 'store']);
        Route::delete('/polls/{poll}', [PollController::class, 'destroy']);
    });
});

// Comments (Public - read only)
Route::get('/comments/{type}/{id}', [\App\Http\Controllers\Api\CommentController::class, 'index']);

// Newsletter (with rate limiting to prevent spam)
Route::post('/newsletter', [\App\Http\Controllers\Api\NewsletterController::class, 'store'])
    ->middleware('throttle:5,1');
