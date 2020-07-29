<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class raegent_material_for_moving extends Model
{
    protected $table = "raegent_material_for_moving";
    protected $fillable = [
        'id_moving',
        'id',
        'id_material',
        'packing_name',
        'amount',
        'id_location',
        'shelf_life',
        'date_create'
    ];
}
