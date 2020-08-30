<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class equipment_list_work_maintenance extends Model
{
	protected $table = "equipment_list_work_maintenance";
	public $timestamps = false;
	protected $fillable = [
		'id_equipment',
		'id_type_maintenance',
		'id_maintenance',
		'id_executor',
		'periodicity'
	];
}