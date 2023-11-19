<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class services_kind extends Model
{
	protected $table = "equipment_services_kind";
	public $timestamps = false;
	protected $fillable = [
		'kind'
	];
}