<?php
namespace App\Models\Gz;

use Illuminate\Database\Eloquent\Model;

class gz_methodplanyear extends Model
{
    protected $table = "gz_methodplanyear";
    public $timestamps = false;
    protected $fillable = [
		'id_method',
		'id_vetstation',
		'id_animal',
		'plan'
    ];
}
