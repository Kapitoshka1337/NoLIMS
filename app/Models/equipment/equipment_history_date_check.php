<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class equipment_history_date_check extends Model
{
    protected $table = "equipment_history_date_check";
	public $timestamps = false;
	protected $fillable = [
		'id_equipment',
		'upload_file_name',
		'id_upload_document_type',
		'number_document',
		'date_current_check',
		'date_next_check'
	];
}
