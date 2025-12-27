<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Thread;
use Illuminate\Auth\Access\HandlesAuthorization;

class ThreadPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_thread');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Thread $thread): bool
    {
        return $user->can('view_thread');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_thread');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Thread $thread): bool
    {
        return $user->can('update_thread');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Thread $thread): bool
    {
        return $user->can('delete_thread');
    }

    /**
     * Determine whether the user can bulk delete.
     */
    public function deleteAny(User $user): bool
    {
        return $user->can('delete_any_thread');
    }

    /**
     * Determine whether the user can permanently delete.
     */
    public function forceDelete(User $user, Thread $thread): bool
    {
        return $user->can('force_delete_thread');
    }

    /**
     * Determine whether the user can permanently bulk delete.
     */
    public function forceDeleteAny(User $user): bool
    {
        return $user->can('force_delete_any_thread');
    }

    /**
     * Determine whether the user can restore.
     */
    public function restore(User $user, Thread $thread): bool
    {
        return $user->can('restore_thread');
    }

    /**
     * Determine whether the user can bulk restore.
     */
    public function restoreAny(User $user): bool
    {
        return $user->can('restore_any_thread');
    }

    /**
     * Determine whether the user can replicate.
     */
    public function replicate(User $user, Thread $thread): bool
    {
        return $user->can('replicate_thread');
    }

    /**
     * Determine whether the user can reorder.
     */
    public function reorder(User $user): bool
    {
        return $user->can('reorder_thread');
    }
}
