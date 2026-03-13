<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        $items = MenuItem::with('category')->get()->map(function ($item) {
            return [
                'id'          => $item->id,
                'name'        => $item->name,
                'price'       => $item->price,
                'stock'       => $item->stock,  
                'category_id' => $item->category_id,
                'category'    => $item->category,
                'availability'=> $item->availability,
            ];
        });

        return response()->json($items, 200);
    }

    public function show($id)
    {
        $item = MenuItem::with('category')->findOrFail($id);
        return response()->json($item, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string',
            'price'       => 'required|numeric',
            'stock'       => 'required|integer',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'availability'=> 'nullable|boolean',
        ]);

        $item = MenuItem::create([
            'name'         => $validated['name'],
            'price'        => $validated['price'],
            'stock'        => $validated['stock'],  
            'category_id'  => $validated['category_id'],
            'description'  => $validated['description'] ?? null,
            'availability' => $validated['availability'] ?? true,
        ]);

        return response()->json($item, 201);
    }

    public function update(Request $request, $id)
    {
        $item = MenuItem::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'sometimes|string',
            'price'       => 'sometimes|numeric',
            'stock'       => 'sometimes|integer',
            'category_id' => 'sometimes|exists:categories,id',
            'description' => 'nullable|string',
            'availability'=> 'nullable|boolean',
        ]);

        $item->update($validated);

        return response()->json($item, 200);
    }

    public function destroy($id)
    {
        $item = MenuItem::findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Item deleted.'], 200);
    }

    public function restock(Request $request, $id)
    {
        $request->validate(['amount' => 'required|integer|min:1']);

        $item = MenuItem::findOrFail($id);
        $item->increment('stock', $request->amount);

        return response()->json([
            'message'   => "Restocked {$item->name}!",
            'new_stock' => $item->stock
        ]);
    }
}