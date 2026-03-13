<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\InventoryLog;
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

        $log = InventoryLog::create([
            'menu_item_id'  => $request->menu_item_id,
            'change_amount' => $request->change_amount,
            'reason'        => $request->reason ?? 'Manual adjustment',
            'user_id'       => auth()->id(),
        ]);

        return response()->json($log, 201);
    }
}