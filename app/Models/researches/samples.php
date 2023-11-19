<?php

namespace App\Models\researches;

use Illuminate\Database\Eloquent\Model;

class samples extends Model
{
    protected $table = "res_samples";
    public $timestamps = false;
    protected $fillable = [
        'id',
        'id_user',
        'reg_num',
        'name',
        'date_current_check',
        'date_next_check'
    ];
    public function users()
    {
        return $this->hasOne('App\models\user', 'id', 'id_user');
    }
}
