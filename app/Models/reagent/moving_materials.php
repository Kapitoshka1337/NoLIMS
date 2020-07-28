<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class moving_materials extends Model
{
    protected $table = "reagent_moving_materials";
    protected $fillable = [
        // 'id',
        'id_moving',
        'id_arrival_material',
        'amount',
        'id_location'
    ];
}
