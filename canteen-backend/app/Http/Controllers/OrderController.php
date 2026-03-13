<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['items'])->latest()->get();
        return response()->json($orders, 200);
    }

    public function show($id)
    {
        $order = Order::with(['items'])->findOrFail($id);
        return response()->json($order, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items'                  => 'required|array',
            'items.*.menu_item_id'   => 'required|exists:menu_items,id',
            'items.*.quantity'       => 'required|integer|min:1',
            'items.*.price'          => 'required|numeric',
            'total_amount'           => 'required|numeric',
        ]);

        try {
            return DB::transaction(function () use ($validated) {

                $orderNumber = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(4));

                $order = Order::create([
                    'order_number' => $orderNumber,
                    'total_amount' => $validated['total_amount'],
                    'status'       => 'Pending',
                    'user_id'      => auth()->id() ?? 1,
                ]);

                foreach ($validated['items'] as $item) {
                    $menuItem = MenuItem::lockForUpdate()->find($item['menu_item_id']);

                    if (!$menuItem) {
                        throw new \Exception("Menu item not found.");
                    }

                    if ($menuItem->stock < $item['quantity']) {
                        throw new \Exception("Insufficient stock for {$menuItem->name}");
                    }

                    $menuItem->decrement('stock', $item['quantity']);

                    $order->items()->attach($menuItem->id, [
                        'quantity' => $item['quantity'],
                        'price'    => $item['price'],
                    ]);
                }

                return response()->json([
                    'message'      => 'Transaction Successful!',
                    'order_id'     => $order->id,
                    'order_number' => $order->order_number,
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,Preparing,Ready,Completed,Cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Order status updated.',
            'order'   => $order,
        ], 200);
    }
}