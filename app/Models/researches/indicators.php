<?php

namespace App\Models\researches;

use Illuminate\Database\Eloquent\Model;

class indicators extends Model
{
    protected $table = "res_indicators";
    public $timestamps = false;
    protected $fillable = [
        'id',
        'name',
        'metod',
        'id_department'
    ];
}
