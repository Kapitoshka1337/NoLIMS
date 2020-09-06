<?php
namespace App\Models\Gz;

use Illuminate\Database\Eloquent\Model;

class gz_methodplan extends Model
{
    protected $table = "gz_methodplan";
    public $timestamps = false;
    protected $fillable = [
		'id_block',
		'block_plan',
		'id_mpy'
    ];
}
