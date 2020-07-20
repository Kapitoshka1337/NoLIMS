<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class arrivals extends Model
{
    protected $table = "reagent_arrivals_";
    protected $fillable = [
        'id',
        'num_order',
        'date_order',
        'department',
        'moving_type'
        // 'id',
        // 'id_material',
        // 'id_department',
        // 'type',
        // 'material',
        // 'measure',
        // 'amount',
        // 'shelf_life',
        // 'date_create',
        // 'moving_type'
    ];
}
