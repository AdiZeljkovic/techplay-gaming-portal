<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission; // Optional
use App\Models\User;
use Illuminate\Support\Facades\Hash; // Import Hash

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Roles
        $roles = ['super_admin', 'Admin', 'editor', 'moderator', 'writer', 'User'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // Create Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            ['name' => 'Super Admin', 'password' => Hash::make('password'), 'email_verified_at' => now()]
        );
        $admin->assignRole('super_admin');

        $editor = User::firstOrCreate(
            ['email' => 'editor@techplay.com'],
            ['name' => 'Chief Editor', 'password' => Hash::make('password'), 'email_verified_at' => now()]
        );
        $editor->assignRole('editor');

        $moderator = User::firstOrCreate(
            ['email' => 'mod@techplay.com'],
            ['name' => 'Community Mod', 'password' => Hash::make('password'), 'email_verified_at' => now()]
        );
        $moderator->assignRole('moderator');

        $writer = User::firstOrCreate(
            ['email' => 'writer@techplay.com'],
            ['name' => 'Staff Writer', 'password' => Hash::make('password'), 'email_verified_at' => now()]
        );
        $writer->assignRole('writer');
    }
}
