<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\InventoryLog;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index()
    {
        $logs = InventoryLog::with(['menuItem', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($logs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'menu_item_id'  => 'required|exists:menu_items,id',
            'change_amount' => 'required|integer',
            'reason'        => 'nullable|string',
        ]);

        $item = MenuItem::findOrFail($request->menu_item_id);
        $item->increment('stock', $request->change_amount);

        $log = InventoryLog::create([
            'menu_item_id'  => $request->menu_item_id,
            'change_amount' => $request->change_amount,
            'reason'        => $request->reason ?? 'Manual adjustment',
            'user_id'       => auth()->id(),
        ]);

        return response()->json($log, 201);
    }

    public function bulkRestock(Request $request)
    {
        $request->validate([
            'items'          => 'required|array',
            'items.*.id'     => 'required|exists:menu_items,id',
            'items.*.amount' => 'required|integer|min:1',
        ]);

        $updated = [];
        foreach ($request->items as $data) {
            $item = MenuItem::findOrFail($data['id']);
            $item->increment('stock', $data['amount']);

            InventoryLog::create([
                'menu_item_id'  => $item->id,
                'change_amount' => $data['amount'],
                'reason'        => 'Bulk restock',
                'user_id'       => auth()->id(),
            ]);

            $updated[] = [
                'id'        => $item->id,
                'name'      => $item->name,
                'new_stock' => $item->stock,
            ];
        }

        return response()->json([
            'message' => 'Bulk restock successful.',
            'updated' => $updated,
        ]);
    }
}