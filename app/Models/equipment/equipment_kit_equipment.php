<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class equipment_kit_equipment extends Model
{
	protected $table = "equipment_kit_equipment";
	public $timestamps = false;
	protected $fillable = [
		'id_checks',
		'id_department',
		'id_equipment',
		// 'is_received_before',
		// 'is_received_after'
	];
}