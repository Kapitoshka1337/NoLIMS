<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class services_type extends Model
{
	protected $table = "equipment_services";
	public $timestamps = false;
	protected $fillable = [
		'title',
		'id_services_kind'
	];
}