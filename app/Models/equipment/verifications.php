<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class verifications extends Model
{
	protected $table = "equipment_checks";
	public $timestamps = false;
	protected $fillable = [
		'id_status_check',
		'id_department',
		'date_create',
		'date_submit'
	];
}