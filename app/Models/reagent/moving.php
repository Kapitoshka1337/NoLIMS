<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class moving extends Model
{
    protected $table = "reagent_moving";
    public $timestamps = false;
    protected $fillable = [
        // 'id',
        'id_department_from',
        'id_department_to',
        'id_user',
        'date_moving',
        'created_at',
        'id_moving_status'
    ];
}
