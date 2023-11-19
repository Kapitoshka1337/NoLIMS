<?php

namespace App\Models\researches;

use Illuminate\Database\Eloquent\Model;

class direction extends Model
{
    protected $table = "res_direction";
    public $timestamps = false;
    protected $fillable = [
        'id',
        'id_samples',
        'id_indicator',
        'massa',
        'SI',
        'metod',
        'note'
    ];
    public function samples()
    {
        return $this->hasOne('App\models\share\samples', 'id', 'id_samples');
    }
    public function indicator()
    {
        return $this->hasOne('App\models\share\indicator', 'id', 'id_indicator');
    }
}
