<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class correction extends Model
{
    protected $table = "reagent_correction";
    public $timestamps = false;
    protected $fillable = [
        'id',
        'id_user',
        'id_department',
        'id_outgo',
        'corrected_amount',
        'reason_correct',
        'spent_amount',
        'created_at',
        'id_status',
        'date_response'
    ];
}
