<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class maintenances extends Model
{
	protected $table = "equipment_list_maintenance";
	public $timestamps = false;
	protected $fillable = [
		'title'
	];
}