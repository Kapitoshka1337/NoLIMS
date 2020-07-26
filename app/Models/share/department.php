<?php

namespace App\Models\share;

use Illuminate\Database\Eloquent\Model;

class department extends Model
{
    protected $table = "department";
    public $timestamps = false;
    protected $fillable = [
        'id', 'title', 'number'
    ];
}
