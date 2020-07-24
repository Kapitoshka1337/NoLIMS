<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class errors extends Model
{
    protected $table = "reagent_errors_index";
    public $timestamps = false;
    protected $fillable = [
        'id',
        'id_user',
        'id_outgo',
        'corrected_amount',
        'reason_correct',
        'created_at',
        'id_status'
    ];
}
