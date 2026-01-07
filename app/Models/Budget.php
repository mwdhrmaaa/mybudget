<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'period',
        'start_date',
        'end_date',
        'description',
    ];

    /**
     * Get the expenses for this budget logic if needed later
     */
}
