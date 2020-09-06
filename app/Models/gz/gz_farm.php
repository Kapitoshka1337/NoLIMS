<?php
namespace App\Models\Gz;

use Illuminate\Database\Eloquent\Model;

class gz_farm extends Model
{
    protected $table = "gz_farm";
    public $timestamps = false;
    protected $fillable = [
        'title',
        'id_region',
    ];
}
