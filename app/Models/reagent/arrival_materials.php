<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class arrival_materials extends Model
{
    protected $table = "reagent_arrival_index";
    protected $fillable = [
        'id',
        'id_material',
        'id_department',
        'type',
        'material',
        'measure',
        'amount',
        'shelf_life',
        'date_create',
        'moving_type'
    ];
}
