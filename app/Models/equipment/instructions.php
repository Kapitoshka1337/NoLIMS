<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class instructions extends Model
{
	protected $table = "equipment_instructions";
	public $timestamps = false;
	protected $fillable = [
		'number',
		'title',
		'file'
	];
}