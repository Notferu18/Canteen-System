<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:menu_items,id',
            'items.*.qty' => 'required|integer|min:1',
            'total' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_amount' => $validated['total'],
                'status' => 'completed',
            ]);

            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item['id'],
                    'quantity' => $item['qty'],
                    'price' => $item['price'], 
                ]);

                $menuItem = MenuItem::find($item['id']);
                $menuItem->decrement('stock', $item['qty']);
            }

            return response()->json(['message' => 'Order processed successfully', 'order' => $order], 201);
        });
    }
}