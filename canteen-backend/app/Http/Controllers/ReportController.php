<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\MenuItem;
use App\Models\Category;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function getDashboardStats()
    {
        $totalRevenue = Order::sum('total_amount');
        $totalOrders = Order::count();
        $lowStockCount = MenuItem::where('stock', '<=', 5)->count();

        $salesData = Order::select(
            DB::raw('DATE_FORMAT(created_at, "%D") as day'),
            DB::raw('SUM(total_amount) as amount')
        )
        ->where('created_at', '>=', Carbon::now()->subDays(7))
        ->groupBy('day')
        ->orderBy('created_at', 'asc')
        ->get();

        $categoryData = Category::withCount('menuItems')
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'value' => $category->menu_items_count
                ];
            });

        return response()->json([
            'totalRevenue' => number_format($totalRevenue, 2, '.', ''),
            'totalOrders' => $totalOrders,
            'lowStockCount' => $lowStockCount,
            'salesData' => $salesData,
            'categoryData' => $categoryData
        ]);
    }
}