<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'total_amount',
        'user_id',
        'status', 
    ];

    public function items()
    {
        return $this->belongsToMany(MenuItem::class, 'order_items')
                    ->withPivot('quantity', 'price')
                    ->withTimestamps();
    }
}