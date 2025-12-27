<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Scout\Searchable;

use Filament\Models\Contracts\FilamentUser;

class User extends Authenticatable implements FilamentUser
{
    use HasFactory, Notifiable, \Spatie\Permission\Traits\HasRoles, \Laravel\Cashier\Billable, \Spatie\Activitylog\Traits\LogsActivity, \Laravel\Sanctum\HasApiTokens, \Laravel\Fortify\TwoFactorAuthenticatable, Searchable;

    public function getActivitylogOptions(): \Spatie\Activitylog\LogOptions
    {
        return \Spatie\Activitylog\LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontLogIfAttributesChangedOnly(['remember_token']);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'xp',
        'rank_id',
        'banned_at',
        'ban_reason',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'profile_photo_url',
        'next_rank',
        'xp_progress',
        'xp_next_level'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'banned_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    public function isBanned(): bool
    {
        return $this->banned_at !== null;
    }

    public function ban(string $reason = null): void
    {
        $this->update([
            'banned_at' => now(),
            'ban_reason' => $reason,
        ]);
    }

    public function unban(): void
    {
        $this->update([
            'banned_at' => null,
            'ban_reason' => null,
        ]);
    }
    public function profile(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(UserProfile::class);
    }

    public function socialIdentities(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SocialIdentity::class);
    }

    public function rank(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Rank::class);
    }

    public function addXp(int $amount): void
    {
        $this->increment('xp', $amount);
        $this->refreshRank();

        // Check for Level Achievements
        $this->checkAchievementUnlock('level_reach', $this->rank_id); // Assuming rank_id corresponds to level roughly, or we use a separate level calc? 
        // Actually, user->level isn't a column, rank_id is. Let's assume Level = Rank ID for simplicity strictly for the 'level_reach' achievement criteria.
        // Or better: $this->checkAchievementUnlock('level_reach', $this->rank_id); 

        // Sync with Redis Leaderboard
        try {
            app(\App\Services\LeaderboardService::class)->incrementScore($this->id, $amount, 'global');
            app(\App\Services\LeaderboardService::class)->incrementScore($this->id, $amount, 'weekly');
        } catch (\Exception $e) {
            // Log error but don't fail the request
            report($e);
        }
    }

    public function checkAchievementUnlock(string $criteriaType, int $currentValue): void
    {
        // Find achievements of this type that the user DOES NOT have yet
        $potentialAchievements = Achievement::where('criteria_type', $criteriaType)
            ->where('criteria_value', '<=', $currentValue)
            ->get();

        foreach ($potentialAchievements as $achievement) {
            if (!$this->achievements()->where('achievement_id', $achievement->id)->exists()) {
                // Unlock!
                $this->achievements()->attach($achievement->id, ['unlocked_at' => now()]);

                // Award XP for the achievement itself
                $this->increment('xp', $achievement->xp);

                // Notify user (Optional: Create Notification)
                // \App\Models\Notification::create([...]);
            }
        }
    }

    public function refreshRank(): void
    {
        $newRank = Rank::where('min_xp', '<=', $this->xp)->orderBy('min_xp', 'desc')->first();

        if ($newRank && $newRank->id !== $this->rank_id) {
            $this->update(['rank_id' => $newRank->id]);
        }
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
        ];
    }

    // Friendships
    public function friendsOfMine()
    {
        return $this->belongsToMany(User::class, 'friendships', 'sender_id', 'recipient_id')
            ->wherePivot('status', 'accepted')
            ->withTimestamps();
    }

    public function friendOf()
    {
        return $this->belongsToMany(User::class, 'friendships', 'recipient_id', 'sender_id')
            ->wherePivot('status', 'accepted')
            ->withTimestamps();
    }

    public function getFriendsAttribute()
    {
        return $this->friendsOfMine->merge($this->friendOf);
    }

    public function friendRequests()
    {
        return $this->hasMany(Friendship::class, 'recipient_id')->where('status', 'pending');
    }

    public function isFriendWith(User $user)
    {
        return (bool) $this->friends->where('id', $user->id)->count();
    }

    public function hasPendingRequestFrom(User $user)
    {
        return (bool) $this->friendRequests()->where('sender_id', $user->id)->exists();
    }

    public function hasSentRequestTo(User $user)
    {
        return (bool) $this->hasMany(Friendship::class, 'sender_id')
            ->where('recipient_id', $user->id)
            ->where('status', 'pending')
            ->exists();
    }

    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    public function directMessages()
    {
        return $this->hasMany(DirectMessage::class, 'receiver_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(DirectMessage::class, 'sender_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function achievements()
    {
        return $this->belongsToMany(Achievement::class, 'user_achievements')
            ->withPivot('unlocked_at')
            ->withTimestamps();
    }

    public function threads()
    {
        return $this->hasMany(Thread::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    // Gamification Accessors
    public function getProfilePhotoUrlAttribute()
    {
        // Return avatar URL or generate a default one based on name
        return $this->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($this->name ?? 'User') . '&background=random';
    }

    public function getNextRankAttribute()
    {
        return Rank::where('min_xp', '>', $this->xp)->orderBy('min_xp', 'asc')->first();
    }

    public function getXpNextLevelAttribute()
    {
        return $this->next_rank ? $this->next_rank->min_xp : $this->xp; // If max level, maybe just current XP or a cap
    }

    public function getXpProgressAttribute()
    {
        if (!$this->rank || !$this->next_rank) {
            return 100; // Max level or no rank
        }

        $currentLevelBase = $this->rank->min_xp;
        $nextLevelBase = $this->next_rank->min_xp;

        $totalToGain = $nextLevelBase - $currentLevelBase;
        $activeGained = $this->xp - $currentLevelBase;

        return $totalToGain > 0 ? round(($activeGained / $totalToGain) * 100) : 100;
    }

    public function canAccessPanel(\Filament\Panel $panel): bool
    {
        // super_admin, Admin, and Editor can access the admin panel
        if ($panel->getId() === 'admin') {
            return $this->hasRole(['super_admin', 'Admin', 'Editor']);
        }

        return true;
    }

    protected static function booted(): void
    {
        static::created(function (User $user) {
            // Assign default rank (Level 1) if not set
            if (!$user->rank_id) {
                // Assuming Rank ID 1 is the default/lowest rank. 
                // Alternatively: Rank::orderBy('min_xp')->first()->id;
                $user->updateQuietly(['rank_id' => 1]);
            }

            // Assign default role 'User' if no role assigned
            if ($user->roles()->count() === 0) {
                $user->assignRole('User');
            }
        });
    }
}
