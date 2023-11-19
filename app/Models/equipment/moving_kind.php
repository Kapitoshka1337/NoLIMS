<?php
namespace App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;

class moving_kind extends Model
{
	protected $table = "equipment_moving_kind";
	public $timestamps = false;
	protected $fillable = [
		'kind'
	];

	public function types()
	{
		return $this->hasMany(moving_type::class, 'id_moving_kind', 'id');
	}
}