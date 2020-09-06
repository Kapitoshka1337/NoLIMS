<?php
namespace App\Models\Gz;

use Illuminate\Database\Eloquent\Model;

class gz_animal extends Model
{
    protected $table = "gz_animal";
    public $timestamps = false;
    protected $fillable = [
        'title'
    ];
}
