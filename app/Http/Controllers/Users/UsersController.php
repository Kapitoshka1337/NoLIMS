<?php
namespace App\Http\Controllers\Users;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use App\Models\share\users_roles;
use App\Models\share\users;
use App\Models\share\rank;
use App\user_role;

class UsersController extends Controller
{
    public function create()
    {
        // $roles = new roles;
        // return view('roles.create', ['roles' => $roles]);
    }

    public function view()
    {
		return response()->json(user_role::get(), 200);
    }

    public function edit($id)
    {
        // $roles = roles::find($id);
        // return view('roles.edit')->with('roles', $roles)
        //     ->with('id', 'id_user', 'id_roles');
    }

    // public function update(Request $req, $id)
    // {
        // DB::transaction(function() use ($id, $req){
		// 	users_roles::where('id', $id)->update($req->all());
		// });
        // $roles = users_roles::find($id);
        // $roles->id_user = $request->id_user;
        // $roles->id_roles = $request->id_roles;
        // $roles->save();
        // return redirect('/users');
    // }
    public function update($id, Request $req)
    {
        DB::beginTransaction();
        users_roles::where('id', $id)->update([
            'id_user' => $req->input('id_users'),
            'id_role' => $req->input('id_rol'),
        ]);
        DB::commit();
    }
}
