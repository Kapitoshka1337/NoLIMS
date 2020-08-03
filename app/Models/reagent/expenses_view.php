<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class expenses_view extends Model
{
    protected $table = "reagent_outgo_index";
    public $timestamps = false;
    // protected $fillable = [
    //     'id',
    //     'id_arrival_material',
    //     'id_department',
    //     'id_material',
    //     'type',
    //     'material',
    //     'measure',
    //     'amount_arrival',
    //     'date_create',
    //     'amount_outgo',
    //     'date_usage',
    //     'date_record',
    //     'user',
    //     'moving_type'
    // ];
}
