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
        $totalRevenue  = Order::where('status', 'Completed')->sum('total_amount');
        $totalOrders   = Order::count();
        $lowStockCount = MenuItem::where('stock', '<=', 5)->count();

        $salesData = Order::where('status', 'Completed')
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->get()
            ->groupBy(fn($order) => Carbon::parse($order->created_at)->format('D'))
            ->map(fn($group, $day) => [
                'day'    => $day,
                'amount' => $group->sum('total_amount'),
            ])
            ->values();

        $categoryData = Category::withCount('menuItems')
            ->get()
            ->map(fn($cat) => [
                'name'  => $cat->name,
                'value' => $cat->menu_items_count,
            ]);

        $orderTrends = Order::where('created_at', '>=', Carbon::now()->subDays(30))
            ->get()
            ->groupBy(fn($order) => Carbon::parse($order->created_at)->format('M d'))
            ->map(fn($group, $day) => [
                'day'    => $day,
                'orders' => $group->count(),
            ])
            ->values();

        $bestSellers = DB::table('order_items')
            ->join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->select(
                'menu_items.name',
                DB::raw('SUM(order_items.quantity) as total_qty'),
                DB::raw('SUM(order_items.quantity * order_items.price) as revenue')
            )
            ->groupBy('menu_items.id', 'menu_items.name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get();

        return response()->json([
            'totalRevenue'  => number_format($totalRevenue, 2, '.', ''),
            'totalOrders'   => $totalOrders,
            'lowStockCount' => $lowStockCount,
            'salesData'     => $salesData,
            'categoryData'  => $categoryData,
            'orderTrends'   => $orderTrends,
            'bestSellers'   => $bestSellers,
        ]);
    }

    public function salesSummary(Request $request)
    {
        $period = $request->query('period', 'daily');
        $start  = $request->query('start', Carbon::now()->subDays(30));
        $end    = $request->query('end', Carbon::now());

        $orders = Order::where('status', 'Completed')
            ->whereBetween('created_at', [$start, $end])
            ->get();

        $format = match($period) {
            'weekly'  => 'W',
            'monthly' => 'M Y',
            default   => 'M d',
        };

        $summary = $orders
            ->groupBy(fn($o) => Carbon::parse($o->created_at)->format($format))
            ->map(fn($group, $label) => [
                'label'   => $label,
                'revenue' => round($group->sum('total_amount'), 2),
                'orders'  => $group->count(),
            ])
            ->values();

        return response()->json([
            'period'       => $period,
            'total_revenue'=> round($orders->sum('total_amount'), 2),
            'total_orders' => $orders->count(),
            'summary'      => $summary,
        ]);
    }

    public function popularItems()
    {
        $items = DB::table('order_items')
            ->join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->select(
                'menu_items.id',
                'menu_items.name',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.quantity * order_items.price) as revenue')
            )
            ->groupBy('menu_items.id', 'menu_items.name')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        return response()->json($items);
    }

    public function inventoryReport()
    {
        $items = MenuItem::with('category')
            ->get()
            ->map(fn($item) => [
                'id'       => $item->id,
                'name'     => $item->name,
                'category' => $item->category?->name ?? 'Uncategorized',
                'stock'    => $item->stock,
                'status'   => $item->stock <= 5 ? 'Low' : ($item->stock <= 20 ? 'Warning' : 'Stable'),
            ]);

        return response()->json([
            'items'          => $items,
            'low_stock'      => $items->where('status', 'Low')->count(),
            'warning_stock'  => $items->where('status', 'Warning')->count(),
            'stable_stock'   => $items->where('status', 'Stable')->count(),
        ]);
    }
}