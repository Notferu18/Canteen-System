<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ReportController;

Route::post('/login', [AuthController::class, 'login']);

/* PUBLIC ROUTES */
Route::get('/menu-items', [MenuController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);

/* PROTECTED ROUTES */
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/categories', [CategoryController::class, 'store']);

    Route::post('/menu-items', [MenuController::class, 'store']);
    Route::get('/menu-items/{id}', [MenuController::class, 'show']);
    Route::put('/menu-items/{id}', [MenuController::class, 'update']); 
    Route::delete('/menu-items/{id}', [MenuController::class, 'destroy']); 

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    Route::get('/inventory/logs', [InventoryController::class, 'index']);
    Route::post('/inventory/adjust', [InventoryController::class, 'store']);

    Route::get('/reports/dashboard', [ReportController::class, 'getDashboardStats']);
    
    Route::get('/dashboard/stats', [ReportController::class, 'dashboardStats']);
    Route::get('/reports/sales', [ReportController::class, 'salesSummary']);
    Route::get('/reports/popular-items', [ReportController::class, 'popularItems']);
    Route::get('/reports/inventory-status', [ReportController::class, 'inventoryReport']);
});