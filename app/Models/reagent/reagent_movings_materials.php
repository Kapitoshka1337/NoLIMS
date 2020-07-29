<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class reagent_movings_materials extends Model
{
    protected $table = "reagent_movings_materials";
    protected $fillable = [
        'id_moving',
        'id_arrival',
        'material',
        'measure',
        'amount',
        'shelf_life',
        'date_create',
        'total',
        'arrival_amount'
    ];
}
