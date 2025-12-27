<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = ['Administrator', 'Editor', 'Author', 'User'];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // Assign Administrator role to the first user
        $admin = User::first();
        if ($admin) {
            $admin->assignRole('Administrator');
        }
    }
}
