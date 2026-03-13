<?php

namespace App\Http\Controllers;

use App\Models\MenuItem; 
use Illuminate\Http\Request;

class MenuController extends Controller
{
public function index()
{
    
    $items = MenuItem::all()->map(function($item) {
        return [
            'id' => $item->id,
            'name' => $item->name,
            'price' => $item->price,
            'stock' => $item->current_stock, 
            'category_id' => $item->category_id,
        ];
    });

    return response()->json($items, 200);
}

public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string',
        'price' => 'required|numeric',
        'stock' => 'required|integer', 
        'category_id' => 'required|exists:categories,id',
    ]);

    
    $item = MenuItem::create([
        'name' => $validated['name'],
        'price' => $validated['price'],
        'current_stock' => $validated['stock'], 
        'category_id' => $validated['category_id'],
    ]);

    return response()->json($item, 201);
}

public function restock(Request $request, $id)
{
    $request->validate(['amount' => 'required|integer|min:1']);
    
    $item = MenuItem::findOrFail($id);
    $item->increment('stock', $request->amount);

    return response()->json([
        'message' => "Restocked {$item->name}!",
        'new_stock' => $item->stock
    ]);
}
}