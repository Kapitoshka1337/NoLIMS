<?php

namespace App\Models\Reagent;

use Illuminate\Database\Eloquent\Model;

class corrections extends Model
{
    protected $table = "reagent_corrections";
    protected $fillable = [
        'id',
        'user',
        'created_at',
        'date_usage',
        'reason_correct',
        'spent_amount',
        'corrected_amount',
        'id_outgo'
    ];
}
