<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;
use App\Models\Equipment\equipment_kits;

class equipment_executor extends Model
{
	protected $table = "equipment_executor";
	public $timestamps = false;
	protected $fillable = [
		'title'
	];
}