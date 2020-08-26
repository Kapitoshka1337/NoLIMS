<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class equipment_equipment extends Model
{
	protected $table = "equipment_equipment";
	public $timestamps = false;
	protected $fillable = [
		'id_equipment_type',
		'id_function_of_use',
		'id_object_study',
		'number',
		'title',
		'measuring_range',
		'measuring_work',
		'characteristics',
		'accuracy',
		'class_accuracy',
		'purpose_of_use',
		'fif_number',
		'model',
		'serial_number',
		'manufacturer',
		'date_create',
		'date_commissioning',
		'inventory_number',
		'description',
		'is_archive',
		'is_conservation',
		'is_repair',
		'is_check',
		'is_working',
		'id_instruction'
	];
}