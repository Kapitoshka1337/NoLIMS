<?php

namespace App;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

use App\Models\share\users_roles;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $table = "users_";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'password', 'id_department', 'id_rank'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    // protected $casts = [
    //     'email_verified_at' => 'datetime',
    // ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getIdDepartment()
    {
        return $this->id_department;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getRoles()
    {
        return $this->hasMany(users_roles::class, 'id_user')->select('id_role')->get()->pluck('id_role');
    }    
    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return ['name' => $this->name, 'id_department' => $this->id_department, 'roles' => $this->getRoles()];
    }
}
