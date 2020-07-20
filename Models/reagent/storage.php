<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class storage extends Model
{
    protected $table = "reagent_storage_index";
    protected $fillable = [
        'arrival_material_id',
        'id_department',
        'material_id',
        'type',
        'material',
        'measure',
        'amount',
        'packing_name',
        'date_create',
        'shelf_life',
        'passport',
        'total',
        'location',
        'archive'
    ];
}
