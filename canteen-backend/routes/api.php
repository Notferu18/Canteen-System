<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ReportController;
use Illuminate\Auth\AuthenticationException;
use App\Http\Controllers\UserController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/menu-items', [MenuController::class, 'index']);
Route::get('/menu-items/{id}', [MenuController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    Route::middleware('role:admin')->group(function () {

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        Route::post('/menu-items', [MenuController::class, 'store']);
        Route::put('/menu-items/{id}', [MenuController::class, 'update']);
        Route::delete('/menu-items/{id}', [MenuController::class, 'destroy']);

        Route::get('/inventory/logs', [InventoryController::class, 'index']);
        Route::post('/inventory/adjust', [InventoryController::class, 'store']);

        Route::prefix('reports')->group(function () {
            Route::get('/dashboard', [ReportController::class, 'getDashboardStats']);
            Route::get('/sales', [ReportController::class, 'salesSummary']);
            Route::get('/popular-items', [ReportController::class, 'popularItems']);
            Route::get('/inventory-status', [ReportController::class, 'inventoryReport']);
        });
    });
});