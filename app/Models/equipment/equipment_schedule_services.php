<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class equipment_schedule_services extends Model
{
	protected $table = "equipment_schedule_services";
	public $timestamps = false;
	protected $fillable = [
		'id_equipment',
		'id_type_maintenance',
		'id_maintenance',
		'id_executor',
		'periodicity',
		'periodicity_day'
	];
}