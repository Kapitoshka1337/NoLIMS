<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class material extends Model
{
    protected $table = "reagent_material_index";
    protected $fillable = [
        'id',
        'material',
        'type',
        'measure'
    ];
}
