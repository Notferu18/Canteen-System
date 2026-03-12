<?php

namespace App\Http\Controllers;

use App\Models\MenuItem; 
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        $menuItems = MenuItem::all();
        
        return response()->json($menuItems);
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string',
        'price' => 'required|numeric',
        'stock' => 'required|integer',
        'category_id' => 'required|exists:categories,id',
    ]);

    $item = MenuItem::create($validated);

    return response()->json($item, 201);
}
    public function update(Request $request, $id)
    {
        $item = MenuItem::findOrFail($id);
        $item->update($request->all());
        return response()->json($item);
    }

    public function destroy($id)
{
    $item = MenuItem::findOrFail($id);
    $item->delete();
    return response()->json(['message' => 'Item deleted successfully']);
}
}