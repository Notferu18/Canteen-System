<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
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
}
