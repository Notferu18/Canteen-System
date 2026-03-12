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
        'items'        => 'required|array',
        'items.*.id'  => 'required|exists:menu_items,id',
        'items.*.qty' => 'required|integer|min:1',
    ]);

    return DB::transaction(function () use ($validated, $request) {
        $ids       = collect($validated['items'])->pluck('id');
        $menuItems = MenuItem::whereIn('id', $ids)->lockForUpdate()->get()->keyBy('id');

        $calculatedTotal = 0;

        foreach ($validated['items'] as $item) {
            $menuItem = $menuItems->get($item['id']);

            if ($menuItem->stock < $item['qty']) {
                abort(422, "Insufficient stock for: {$menuItem->name}");
            }

            $calculatedTotal += $menuItem->price * $item['qty'];
        }

        $order = Order::create([
            'user_id'      => $request->user()->id,
            'total_amount' => $calculatedTotal, 
            'status'       => 'pending',
        ]);

        foreach ($validated['items'] as $item) {
            $menuItem = $menuItems->get($item['id']);

            OrderItem::create([
                'order_id'     => $order->id,
                'menu_item_id' => $item['id'],
                'quantity'     => $item['qty'],
                'price'        => $menuItem->price, 
            ]);

            $menuItem->decrement('stock', $item['qty']);
        }

        return response()->json([
            'message' => 'Order placed successfully',
            'order'   => $order,
        ], 201);
    });
}
}