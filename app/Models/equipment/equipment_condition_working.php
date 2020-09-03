<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class equipment_condition_working extends Model
{
    protected $table = "equipment_condition_working";
	public $timestamps = false;
	protected $fillable = [
		'id_equipment',
		'temperature',
		'humidity',
		'pressure',
		'voltage',
		'amperage'
	];
}