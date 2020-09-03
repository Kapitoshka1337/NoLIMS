<?php
namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class reagent_arrival_material extends Model
{
    protected $table = "reagent_arrival_material";
    public $timestamps = false;
    protected $fillable = [
        'id_arrival',
        'date_order',
        'id_material',
        'packing_name',
        'amount',
        'id_location',
        'shelf_life',
        'date_create',
        'density',
        'archive',
        'description'
    ];
}