<?php
namespace App\Models\Gz;

use Illuminate\Database\Eloquent\Model;

class gz_pathdata extends Model
{
    protected $table = "gz_pathdata";
    public $timestamps = false;
    protected $fillable = [
		'id_method_plan',
		'id_animal',
		'id_farm',
		'id_region',
		'id_vetstation',
		'place_of_selection',
		'date_add',
		'date_enter',
		'amount',
		'id_empl' 
    ];
}