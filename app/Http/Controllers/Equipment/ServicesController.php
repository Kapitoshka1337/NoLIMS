<?php
namespace App\Http\Controllers\Equipment;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Models\Equipment\maintenances;
use App\Models\Equipment\services_kind;
use App\Models\Equipment\services_type;
use App\Models\Equipment\equipment_schedules_services;

class ServicesController extends Controller
{
	public function view()
	{
		//$services = services_kind::get();
		//$arr = [];
		//foreach ($services as $key)
		//{
		//	$arr[] = ['name' => $key['kind'], 'children' => []];
		//}

		return response()->json(services_kind::get(), 200);
	}

	public function type($id)
	{
		//$services = services_type::where('id_services_kind', $id)->get();
		//$arr = [];
		//foreach ($services as $key)
		//{
		//	$arr[] = ['name' => $key['type'], 'children' => []];
		//}

		return response()->json(services_type::where('id_services_kind', $id)->get(), 200);
	}

	public function equipments($id)
	{
		return response()->json(equipment_schedules_services::where('id_services', $id)->get(), 200);
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
