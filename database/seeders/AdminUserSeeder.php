<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'adi@techplay.gg')->first();

        if ($user) {
            // Model's 'password' => 'hashed' cast handles hashing, so use plain password
            $user->password = 'BubaZeljkovic2112!';
            $user->email_verified_at = now();
            $user->save();
        } else {
            $user = User::create([
                'name' => 'Adi Zeljković',
                'email' => 'adi@techplay.gg',
                'password' => 'BubaZeljkovic2112!',
                'email_verified_at' => now(),
            ]);
        }

        // Assign super_admin role if it exists
        if (class_exists(\Spatie\Permission\Models\Role::class)) {
            $role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
            $user->syncRoles([$role]);
        }

        $this->command->info("Admin user created: {$user->email}");
    }
}
