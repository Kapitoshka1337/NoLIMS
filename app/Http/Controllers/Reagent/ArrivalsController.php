<?php

namespace App\Http\Controllers\Reagent;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

use App\Models\Reagent\arrivals;
use App\Models\Reagent\arrival_materials;
use App\Models\Reagent\reagent_arrivals;
use App\Models\Reagent\reagent_arrival_material;

class ArrivalsController extends Controller
{
	public function view()
	{
		return response()->json(arrivals::where('id_department', auth()->user()->getIdDepartment())->get(), 200);
	}

	public function create(Request $req)
	{
		DB::transaction(function() use ($req){
			$order = reagent_arrivals::create([
				'num_order' => $req->input("num_order"),
				'date_order' => $req->input("date_order"),
				'id_department' => auth()->user()->getIdDepartment(),
				'id_moving_type' => 1
			]);
			foreach ($req->input('materials') as $material)
			{
				$arr[] = array(
					'id_arrival' => $order['id'],
					'date_order' => $order['date_order'],
					'id_material' => $material['id'],
					'packing_name' => $material['post_name'],
					'amount' => $material['amount'],
					'id_location' => $material['id_location'],
					'shelf_life' => $material['shelf_life'],
					'date_create' => $material['date_create'],
					'density' => $material['density'],
					'description' => $material['description']
				);
			}
			reagent_arrival_material::insert($arr);
		});
	}

	public function materials($id)
	{
		$arr_mat = arrival_materials::where('id', $id)->get();
		return response()->json($arr_mat, 200);
	}

	public function updateLocation($id, Request $req)
	{
		DB::transaction(function() use($id, $req){
			reagent_arrival_material::where('id', $id)->update($req->all());
		});
	}
}
