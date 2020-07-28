<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class movings extends Model
{
    protected $table = "reagent_movings";
    protected $fillable = [
        'id',
        'id_department',
        'dep_from',
        'dep_to',
        'user',
        'date_moving',
        'created_at',
        'status'
    ];
}
