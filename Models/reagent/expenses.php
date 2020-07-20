<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class expenses extends Model
{
    protected $table = "reagent_outgo";
    public $timestamps = false;
    protected $fillable = [
        'id',
        'id_department',
        'id_arrival_material',
        'id_user',
        'amount',
        'date_usage',
        'date_record',
        'id_moving_type'
    ];
}
