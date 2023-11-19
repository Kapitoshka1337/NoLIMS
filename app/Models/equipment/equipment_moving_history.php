<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class equipment_moving_history extends Model
{
    protected $table = "equipment_moving_history";
	public $timestamps = false;
	protected $fillable = [
		'id_equipment',
		'id_current_department',
		'id_last_department',
		'id_current_location',
		'id_last_location',
		'date_moving',
		'id_moving_type'
	];
}
