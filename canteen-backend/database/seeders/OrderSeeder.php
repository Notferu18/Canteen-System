<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $menuItems = MenuItem::all();
        $users = User::all();
        $statuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

        for ($i = 0; $i < 200; $i++) {
            $randomUser = $users->random();
            $randomStatus = $statuses[array_rand($statuses)];
            $createdAt = Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));

            $orderItems = $menuItems->random(rand(1, 4));
            $totalAmount = 0;
            $itemsData = [];

            foreach ($orderItems as $menuItem) {
                $quantity = rand(1, 3);
                $price = $menuItem->price;
                $totalAmount += $price * $quantity;
                $itemsData[] = [
                    'menu_item_id' => $menuItem->id,
                    'quantity' => $quantity,
                    'price' => $price,
                ];
            }

            $order = Order::create([
                'order_number' => 'ORD-' . $createdAt->format('Ymd') . '-' . strtoupper(Str::random(4)),
                'total_amount' => $totalAmount,
                'status' => $randomStatus,
                'user_id' => $randomUser->id,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            foreach ($itemsData as $item) {
                $order->items()->attach($item['menu_item_id'], [
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }
        }
    }
}