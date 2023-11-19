<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class moving_type extends Model
{
	protected $table = "equipment_moving_type";
	public $timestamps = false;
	protected $fillable = [
		'type',
		'id_moving_kind'
	];

	public function kinds()
	{
		return $this->belongTo(moving_kind::class, 'id_moving_kind', 'id')->select('type', 'id_moving_kind');
	}
}