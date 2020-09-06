<?php
namespace App\Models\Gz;

use Illuminate\Database\Eloquent\Model;

class gz_vetstation extends Model
{
    protected $table = "gz_vetstation";
    public $timestamps = false;
    protected $fillable = [
        'title'
    ];
}
