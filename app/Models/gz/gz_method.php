<?php
namespace App\Models\Gz;

use Illuminate\Database\Eloquent\Model;

class gz_method extends Model
{
    protected $table = "gz_method";
    public $timestamps = false;
    protected $fillable = [
        'title'
    ];
}
