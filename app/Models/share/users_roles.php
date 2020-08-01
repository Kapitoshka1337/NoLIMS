<?php

namespace App\Models\share;

use Illuminate\Database\Eloquent\Model;

class users_roles extends Model
{
    protected $table = "users_roles";
    public $timestamps = false;
    protected $fillable = ['id_user', 'id_role'];
}
