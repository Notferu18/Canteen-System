<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'total_amount' => 'required|numeric',
        ]);

        try {
            return DB::transaction(function () use ($validated) {
                
                $orderNumber = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(4));

                $order = Order::create([
                    'order_number' => $orderNumber, 
                    'total_amount' => $validated['total_amount'],
                    'user_id' => auth()->id() ?? 1, 
                ]);

                foreach ($validated['items'] as $item) {
                    $menuItem = MenuItem::lockForUpdate()->find($item['menu_item_id']);

                    if ($menuItem->stock < $item['quantity']) {
                        throw new \Exception("Insufficient stock for {$menuItem->name}");
                    }

                    $menuItem->decrement('stock', $item['quantity']);

                    $order->items()->attach($menuItem->id, [
                        'quantity' => $item['quantity'],
                        'price' => $item['price']
                    ]);
                }

                return response()->json([
                    'message' => 'Transaction Successful!',
                    'order_id' => $order->id,
                    'order_number' => $order->order_number
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}