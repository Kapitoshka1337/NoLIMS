<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class location extends Model
{
    protected $table = "reagent_location";
    public $timestamps = false;
    protected $fillable = [
        'id',
        'id_department',
        'cabinet_number',
        'place',
        'notation'
    ];
}
