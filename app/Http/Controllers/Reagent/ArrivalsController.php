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
		return response()->json(arrivals::get(), 200);
	}

	public function create(Request $req)
	{
		DB::transaction(function() use ($req){
			$new_order = new reagent_arrivals();
			$new_order->num_order = $req->input("number");
			$new_order->date_order = $req->input("date");
			$new_order->id_department = 14;
			$new_order->id_moving_type = 1;
			$new_order->save();
			foreach ($req->input('materials') as $material)
			{
				$arr = array(
					'id_arrival' => $new_order->id,
					'id_material' => $material['id'],
					'packing_name' => $material['post_name'],
					'amount' => $material['amount'],
					'id_location' => $material['id_location'],
					'shelf_life' => $material['shelf_life'],
					'date_create' => $material['date_create']
					// 'id_passport' => ,
					// 'archive' => 
				);
			}
			$order_material = reagent_arrival_material::create($arr);

		});
	// return response()->json($req,200);
	}

	public function materials($id)
	{
		$arr_mat = arrival_materials::where('id', $id)->get();
		return response()->json($arr_mat, 200);
	}
}
