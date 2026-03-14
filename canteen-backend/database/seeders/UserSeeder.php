<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;  
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin1213'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Cashier',
            'email' => 'cashier@gmail.com',
            'password' => Hash::make('cash123'),
            'role' => 'cashier',
        ]);

        User::create([
            'name' => 'Customer1',
            'email' => 'customer1@gmail.com',
            'password' => Hash::make('customer123'),
            'role' => 'customer',
        ]);
    }
}