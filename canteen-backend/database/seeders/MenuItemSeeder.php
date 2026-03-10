<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['category_id' => 1, 'name' => 'Classic Burger', 'price' => 55.00, 'stock' => 50],
            ['category_id' => 1, 'name' => 'Double Cheeseburger', 'price' => 85.00, 'stock' => 30],
            ['category_id' => 1, 'name' => '1pc Fried Chicken w/ Rice', 'price' => 75.00, 'stock' => 100],
            ['category_id' => 1, 'name' => '2pc Fried Chicken w/ Rice', 'price' => 120.00, 'stock' => 50],
            ['category_id' => 1, 'name' => 'Meaty Spaghetti', 'price' => 65.00, 'stock' => 40],
            ['category_id' => 1, 'name' => 'Pork Adobo Rice', 'price' => 90.00, 'stock' => 25],

            ['category_id' => 2, 'name' => 'Regular Fries', 'price' => 30.00, 'stock' => 150],
            ['category_id' => 2, 'name' => 'Large BBQ Fries', 'price' => 50.00, 'stock' => 100],
            ['category_id' => 2, 'name' => 'Cheese Hotdog', 'price' => 35.00, 'stock' => 80],
            ['category_id' => 2, 'name' => 'Nachos Overload', 'price' => 70.00, 'stock' => 40],
            ['category_id' => 2, 'name' => 'Corndog', 'price' => 45.00, 'stock' => 60],
            ['category_id' => 2, 'name' => 'Chicken Nuggets (6pcs)', 'price' => 60.00, 'stock' => 50],

            ['category_id' => 3, 'name' => 'Classic Milk Tea', 'price' => 85.00, 'stock' => 100],
            ['category_id' => 3, 'name' => 'Okinawa Milk Tea', 'price' => 95.00, 'stock' => 80],
            ['category_id' => 3, 'name' => 'Iced Coffee', 'price' => 50.00, 'stock' => 120],
            ['category_id' => 3, 'name' => 'Hot Latte', 'price' => 65.00, 'stock' => 60],
            ['category_id' => 3, 'name' => 'Coke Mismo', 'price' => 20.00, 'stock' => 200],
            ['category_id' => 3, 'name' => 'Bottled Water', 'price' => 15.00, 'stock' => 300],

            ['category_id' => 4, 'name' => 'Glazed Donut', 'price' => 30.00, 'stock' => 48],
            ['category_id' => 4, 'name' => 'Chocolate Donut', 'price' => 35.00, 'stock' => 36],
            ['category_id' => 4, 'name' => 'Leche Flan', 'price' => 50.00, 'stock' => 20],
            ['category_id' => 4, 'name' => 'Chocolate Moist Cake', 'price' => 75.00, 'stock' => 15],
            ['category_id' => 4, 'name' => 'Mango Float', 'price' => 60.00, 'stock' => 25],
            ['category_id' => 4, 'name' => 'Halo-Halo Special', 'price' => 85.00, 'stock' => 30],

            ['category_id' => 5, 'name' => 'Burger & Fries Combo', 'price' => 80.00, 'stock' => 40],
            ['category_id' => 5, 'name' => 'Chicken & Spaghetti Combo', 'price' => 135.00, 'stock' => 30],
            ['category_id' => 5, 'name' => 'Hotdog & Soda Combo', 'price' => 50.00, 'stock' => 50],
            ['category_id' => 5, 'name' => 'Barkada Platter', 'price' => 499.00, 'stock' => 10],
            ['category_id' => 5, 'name' => 'Breakfast Tipid Meal', 'price' => 99.00, 'stock' => 20],
            ['category_id' => 5, 'name' => 'Ultimate Feast', 'price' => 250.00, 'stock' => 15],
        ];

        foreach ($items as $item) {
            MenuItem::create(array_merge($item, [
                'description' => 'Freshly prepared ' . $item['name'],
                'availability' => true
            ]));
        }
    }
}