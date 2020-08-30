<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;
use App\Models\Equipment\equipment_kits;

class equipment_type_maintenance extends Model
{
	protected $table = "equipment_type_maintenance";
	public $timestamps = false;
	protected $fillable = [
		'title'
	];
}