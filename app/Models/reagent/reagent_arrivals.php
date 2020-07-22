<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class reagent_arrivals extends Model
{
    protected $table = "reagent_arrivals";
    public $timestamps = false;
    protected $fillable = [
        'id',
        'num_order',
        'date_order',
        'id_department',
        'id_moving_type'
    ];
}
