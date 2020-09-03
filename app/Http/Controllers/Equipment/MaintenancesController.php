<?php
namespace App\Http\Controllers\Equipment;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Models\Equipment\maintenances;

class MaintenancesController extends Controller
{
	public function view()
	{
		return response()->json(maintenances::get(), 200);
	}

	public function create(Request $req)
	{
		DB::transaction(function() use ($req){
			maintenances::insert($req->all());
		});
	}

	public function update($id, Request $req)
	{
		DB::transaction(function() use ($id, $req){
			maintenances::where('id', $id)->update($req->all());
		});
	}
}
