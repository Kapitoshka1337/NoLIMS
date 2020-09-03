<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class equipment_repair_request extends Model
{
    protected $table = "equipment_repair_request";
	public $timestamps = false;
	protected $fillable = [
		'id',
		'id_equipment',
		'id_user',
		'problem',
		'id_status',
		'date_request',
		'date_start',
		'date_end',
		'accepted',
		'executor',
		'request_report'
	];
}