<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialIdentity;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect to the provider's OAuth page.
     */
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle the callback from the provider.
     */
    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/profile?error=auth_failed');
        }

        $user = Auth::user();

        // 1. Check if identity exists
        $identity = SocialIdentity::where('provider_name', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if ($identity) {
            // Identity exists. 
            // If logged in, check if it matches current user.
            if ($user) {
                if ($identity->user_id !== $user->id) {
                    return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/profile?error=already_linked_to_another');
                }
                // Already linked to this user, do nothing
            } else {
                // Not logged in, log in with this identity
                Auth::login($identity->user);
            }
        } else {
            // Identity does not exist.
            if ($user) {
                // Link to current user
                $user->socialIdentities()->create([
                    'provider_name' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'token' => $socialUser->token,
                ]);
            } else {
                // Not logged in. Check if email exists to link or create new user.
                $user = User::where('email', $socialUser->getEmail())->first();

                if (!$user) {
                    // Create new user (Auto-registration)
                    $user = User::create([
                        'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'Gamer',
                        'email' => $socialUser->getEmail(), // Note: Steam might not provide email
                        'password' => bcrypt(\Illuminate\Support\Str::random(16)), // Random password
                        'email_verified_at' => now(),
                    ]);

                    // Init profile
                    $user->profile()->create([
                        'avatar_url' => $socialUser->getAvatar(),
                        'bio' => 'Joined via ' . ucfirst($provider),
                    ]);
                }

                // Create identity
                $user->socialIdentities()->create([
                    'provider_name' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'token' => $socialUser->token,
                ]);

                Auth::login($user);
            }
        }

        return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/profile');
    }
}
