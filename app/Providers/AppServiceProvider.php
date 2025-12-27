<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Event::listen(
            \SocialiteProviders\Manager\SocialiteWasCalled::class,
            function ($event) {
                $event->extendSocialite('steam', \SocialiteProviders\Steam\Provider::class);
                $event->extendSocialite('discord', \SocialiteProviders\Discord\Provider::class);
            }
        );

        \App\Models\Comment::observe(\App\Observers\UserActivityObserver::class);
        \App\Models\Thread::observe(\App\Observers\UserActivityObserver::class);
        \App\Models\Post::observe(\App\Observers\UserActivityObserver::class);
        \App\Models\Article::observe(\App\Observers\ArticleObserver::class);
        \App\Models\Review::observe(\App\Observers\ReviewObserver::class);

        // Implicitly grant "Super Admin" role all permissions
        // This works in the app by using gate-related functions like auth()->user->can() and @can()
        \Illuminate\Support\Facades\Gate::before(function ($user, $ability) {
            return $user->hasRole('super_admin') || $user->hasRole('Admin') ? true : null;
        });

        // Rate Limiting Configuration
        \Illuminate\Support\Facades\RateLimiter::for('api', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // Strict rate limiting for authentication endpoints
        \Illuminate\Support\Facades\RateLimiter::for('auth', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(5)->by($request->ip());
        });

        // Fortify login rate limiter (5 attempts per minute per email+IP)
        \Illuminate\Support\Facades\RateLimiter::for('login', function (\Illuminate\Http\Request $request) {
            $email = (string) $request->input('email');
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(5)->by($email . '|' . $request->ip());
        });

        // Two-factor authentication rate limiter
        \Illuminate\Support\Facades\RateLimiter::for('two-factor', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
    }
}
