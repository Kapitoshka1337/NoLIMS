<?php
namespace App\Http\Controllers\Gz;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Gz\gz_method;

class MethodController extends Controller
{
	public function view()
	{
		return response()->json(gz_method::get() ,200);
	}

	public function create(Request $req)
	{
		DB::transaction(function() use ($req){
			gz_method::insert($req->all());
		});
	}

	public function update($id, Request $req)
	{
		DB::transaction(function() use ($id, $req){
			gz_method::where('id', $id)->update($req->all());
		});
	}
}