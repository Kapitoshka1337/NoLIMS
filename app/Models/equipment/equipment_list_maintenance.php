<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;
use App\Models\Equipment\equipment_kits;

class equipment_list_maintenance extends Model
{
	protected $table = "equipment_list_maintenance";
	public $timestamps = false;
	protected $fillable = [
		'description'
	];
}