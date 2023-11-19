<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class roles extends Model
{
    protected $table = "users_roles";
    protected $fillable = [
        'id',
        'id_user',
        'id_role'
    ];
}
