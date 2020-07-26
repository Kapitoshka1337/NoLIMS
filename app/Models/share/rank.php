<?php

namespace App\Models\share;

use Illuminate\Database\Eloquent\Model;

class rank extends Model
{
    protected $table = "rank";
    public $timestamps = false;
    protected $fillable = [
        'id', 'title'
    ];
}
