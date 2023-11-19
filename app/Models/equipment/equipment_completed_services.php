<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class equipment_completed_services extends Model
{
	protected $table = "equipment_completed_services";
	public $timestamps = false;
	protected $fillable = [
		'id_work',
		'id_equipment',
		'date_completed',
		'id_user'
	];
}