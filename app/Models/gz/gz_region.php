<?php
namespace App\Models\Gz;

use Illuminate\Database\Eloquent\Model;

class gz_region extends Model
{
    protected $table = "gz_region";
    public $timestamps = false;
    protected $fillable = [
        'title',
        'id_vetstation',
    ];
}
